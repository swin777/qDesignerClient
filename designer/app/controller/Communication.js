Ext.define('Designer.controller.Communication', {

	extend: 'Ext.app.Controller',
	
	roomId : '',
	
	diagramId : '',
	
	init: function() {
		this.control({
		});
	},
    
	onLaunch : function() {
		var self = this;
		
		// 웹 소켓 서버에 접속 
		try {
			this.connectWebsocket();
			// 동시 작업 초대 요청 
			Designer.app.eventbus.on('cooperrequest', this.requestCooperation, this);
		} catch(e) {
			console.error(e);
		}
	},
	
	connectWebsocket : function() {
		var self = this;
		
		this.socket = Ext.ux.websocket.WebSocket.create({
			server: 'socket.io',
			url: websocketUrl,
			debug: false,
			listeners: {
				connect: function(ws) {
					var connMsg = JSON.stringify({type : 'connection', loginId : login.id});
					ws.emit('connection', connMsg);
				},
				
				message: function(ws, message) {
					var connMsg = Ext.JSON.decode(message.getData());
					
					if(!connMsg.type) {
					
					// connect to server
					} else if(connMsg.type == 'connection') {
						Ext.Msg.alert('Connection', connMsg.data);
						
					// 초대장을 받는 쪽 
					} else if(connMsg.type == 'invitation') {
						Ext.Msg.confirm('Cooperation requested', 'Accept the diagram [' + connMsg.diagramTitle + '] cooperation request by [' + connMsg.hostName + ']?', function(btn) {
							if(btn == 'yes') {
								self.acceptCooperation(ws, connMsg);
							} else {
								self.rejectCooperation(ws, connMsg);
							}
						});
						
					// 초대장을 보낸 쪽 - 허락
					} else if(connMsg.type == 'invitation_accept') {
						self.repliedAcceptCooperation(ws, connMsg);
						
					// 초대장을 보낸 쪽 - 거절 
					} else if(connMsg.type == 'invitation_reject') {
						self.repliedRejectCooperation(ws, connMsg);
						
					// 대화 
					} else if(connMsg.type == 'msg') {
						self.diagramChangedBySocket(ws, connMsg);
											
					// 기타 
					} else {
						Ext.Msg.alert('Invalid message', 'Invalid message type ' + connMsg.type + '!');
					}
				},
				
				close: function(ws) {
					Ext.Msg.alert('Socket closed ', event.getCode() + ' -> ' + event.getReason());
				},
				
				error: function(ws, error) {
					Ext.Msg.alert('WebSocket Error', Ext.JSON.encode(error));
				}
			}
		});
	},
	
	requestCooperation : function(userId, diagramId, diagramTitle) {
		var buddyId = [userId];
		var message = JSON.stringify({
			type : 'invitation', 
			buddies : buddyId, 
			hostId : login.id, 
			hostName : login.name,
			diagramId : diagramId,
			diagramTitle : diagramTitle
		});
		this.socket.ws.emit('invitation', message);
	},
	
	acceptCooperation : function(ws, coopMsg) {
		var sendMsg = JSON.stringify({ type:'join', userId: login.id, roomId: coopMsg.roomId });
		ws.emit('join', sendMsg);
		
		this.roomId = coopMsg.roomId;
		this.diagramId = coopMsg.diagramId;
				
		this.openDiagram(coopMsg.diagramId, coopMsg.diagramTitle, this);
		sendMsg = JSON.stringify({ 
			type: 'invitation_accept', 
			userName: login.name, 
			hostId: coopMsg.hostId, 
			userId: login.id, 
			diagramId: coopMsg.diagramId, 
			diagramTitle: coopMsg.diagramTitle
		});
		
		ws.emit('invitation_accept', sendMsg);
		Ext.Msg.alert('Accepted', 'You accepted diagram [' + coopMsg.diagramTitle + '] cooperation request!\n Cooperation start!');
	},
	
	rejectCooperation : function(ws, coopMsg) {
		var sendMsg = JSON.stringify({ 
			type:'invitation_reject', 
			userName: login.name, 
			hostId: coopMsg.hostId, 
			userId: login.id, 
			diagramId : coopMsg.diagramId, 
			diagramTitle : coopMsg.diagramTitle
		});
		
		ws.emit('invitation_reject', sendMsg);		
	},
	
	repliedAcceptCooperation : function(ws, coopMsg) {
		this.roomId = coopMsg.roomId;
		this.diagramId = coopMsg.diagramId;
		var hatioCanvas = this.getHatioCanvas(this.diagramId);
		hatioCanvas.getCommandStack().addEventListener(this);
		Ext.Msg.alert('Invitation accepted', 'User [' + coopMsg.userName + '] accepted [' + coopMsg.diagramTitle + '] cooperation!');
	},
	
	repliedRejectCooperation : function(ws, coopMsg) {
		Ext.Msg.alert('Invitation rejected', 'User [' + coopMsg.userName + '] rejected [' + coopMsg.diagramTitle + '] cooperation!');
	},
	
	openDiagram : function(diagramId, diagramTitle, commandStackListener) {
		var command = Designer.command.CommandManager.getCommand('Designer.command.file.Download');
		command.download(diagramId, diagramTitle, commandStackListener);
	},
	
	stackChanged : function(event) {
		var attrs = {};
		var command = event.getCommand();
		
		// remote로 부터 발생한 이벤트라면 다시 보내지 않는다. 
		if(command.ignore || event.isPreChangeEvent())
			return;
			
		if(command.figure) {
			attrs = command.figure.getPersistentAttributes();
			var message = JSON.stringify({ 
				type: 'msg', 
				userName: login.name, 
				loginId: login.id, 
				roomId: this.roomId,
				diagramId: this.diagramId,
				eventType: command.NAME, 
				event: {
					attrs : attrs
				}
			});
			this.socket.ws.emit('msg', message);
		}
	},
	
	diagramChangedBySocket : function(ws, coopMsg) {
		
		if(coopMsg.loginId != login.id) {
			var eventType = coopMsg.eventType;
			if(eventType == 'ashDraw.command.CommandMove') {
				this.onFigureMoved(ws, coopMsg);
			} else if(eventType == 'ashDraw.command.CommandAdd') {
				this.onFigureAdded(ws, coopMsg);
			} else if(eventType == 'ashDraw.command.CommandDelete') {
				this.onFigureDeleted(ws, coopMsg);
			} else if(eventType == 'ashDraw.command.CommandConnect') {
				this.onConnectionConnected(ws, coopMsg);
			} else if(eventType == 'ashDraw.command.CommandReconnect') {
				this.onConnectionReconnected(ws, coopMsg);
			} else if(eventType == 'ashDraw.command.CommandResize') {
				this.onFigureResized(ws, coopMsg);
			} 
		}
	},
	
	onFigureAdded : function(ws, coopMsg) {
		// TODO figure add시에는 figure의 id가 uuid로 생성되기 때문에 아이디 동기화가 되지 않는다. id를 박아서 넘겨도 새로 생성될 때는 id가 바뀌어 버린다. ...
		var hatioCanvas = this.getHatioCanvas(coopMsg.diagramId);
		hatioCanvas.setCurrentSelection(null);
		hatioCanvas.mouseActClear();
        hatioCanvas.portDragMode = false;
		if(hatioCanvas) {
			var figureAttrs = coopMsg.event.attrs;
			var figure;
			if(figureAttrs.type=='hatio.shape.node.basic.CustomSvgFigure'){
				figure = new hatio.shape.node.basic.CustomSvgFigure(figureAttrs.node_id);
			}else{
				figure = eval('new ' + figureAttrs.type + '();');
			}
			var command = new ashDraw.command.CommandAdd(hatioCanvas, figure, figureAttrs.x, figureAttrs.y);
			command.ignore = 'y';
			hatioCanvas.getCommandStack().execute(command);
		}
	},
	
	onFigureDeleted : function(ws, coopMsg) {
		var hatioCanvas = this.getHatioCanvas(coopMsg.diagramId);
		hatioCanvas.setCurrentSelection(null);
		hatioCanvas.mouseActClear();
        hatioCanvas.portDragMode = false;
		if(hatioCanvas) {
			var figureAttrs = coopMsg.event.attrs;
			var figure = null;
			
			if(figureAttrs.type == 'ashDraw.Connection') {
				figure = hatioCanvas.getLine(figureAttrs.id);
			} else {
				figure = hatioCanvas.getFigure(figureAttrs.id);
			}
			
			if(figure) {
				var command = new ashDraw.command.CommandDelete(figure);
				command.ignore = 'y';
				hatioCanvas.getCommandStack().execute(command);
			}
		}
	},
	
	onFigureMoved : function(ws, coopMsg) {
		var hatioCanvas = this.getHatioCanvas(coopMsg.diagramId);
		hatioCanvas.setCurrentSelection(null);
		hatioCanvas.mouseActClear();
        hatioCanvas.portDragMode = false;
		if(hatioCanvas) {
			var figureAttrs = coopMsg.event.attrs;
			var figure = hatioCanvas.getFigure(figureAttrs.id);
			
			if(figure) {
				figure.setPersistentAttributes(figureAttrs);
				figure.repaint(figureAttrs);
				figure.fireMoveEvent();
				
				/* TODO Use command
				var command = new ashDraw.command.CommandMove(figure, figureAttrs.x, figureAttrs.y);
				command.ignore = 'y';
				hatioCanvas.getCommandStack().execute(command);*/
			}
		} 
	},
	
	onConnectionConnected : function(ws, coopMsg) {
		var hatioCanvas = this.getHatioCanvas(coopMsg.diagramId);
		hatioCanvas.setCurrentSelection(null);
		hatioCanvas.mouseActClear();
        hatioCanvas.portDragMode = false;
		if(hatioCanvas) {
			// TODO when connection connected
		}
	},
	
	onConnectionReconnected : function(ws, coopMsg) {
		var hatioCanvas = this.getHatioCanvas(coopMsg.diagramId);
		hatioCanvas.setCurrentSelection(null);
		hatioCanvas.mouseActClear();
        hatioCanvas.portDragMode = false;
		if(hatioCanvas) {
			// TODO when connection other target connected
		}
	},
	
	onFigureResized : function(ws, coopMsg) {
		var hatioCanvas = this.getHatioCanvas(coopMsg.diagramId);
		hatioCanvas.setCurrentSelection(null);
		hatioCanvas.mouseActClear();
        hatioCanvas.portDragMode = false;
		if(hatioCanvas) {
			var figureAttrs = coopMsg.event.attrs;
			var figure = hatioCanvas.getFigure(figureAttrs.id);
			
			if(figure) {
				var command = new ashDraw.command.CommandResize(figure, figureAttrs.x, figureAttrs.y);
				command.setDimension(figureAttrs.width, figureAttrs.height);
				command.ignore = 'y';
				hatioCanvas.getCommandStack().execute(command);
			}
		}
	},
	
	getHatioCanvas : function(diagramId) {
		var canvasTab = Designer.app.findCanvasTab(diagramId);
		return canvasTab ? canvasTab.getHatioCanvas() : null;
	}
});