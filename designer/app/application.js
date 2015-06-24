/*
Copyright(c) 2012 Hatiolab.com
*/
Ext.Loader.setConfig({
	enabled : true,
	paths : {
		'Designer' : 'app'
	}
});

Ext.require([
	'Designer.command.CommandManager',
	'Designer.util.Base64'
]);

Ext.application({
	name : 'Designer',
  	autoCreateViewport : false,
  	models : ['Menu'],
  	stores : ['Menu', 'Directory', 'DiagramDefinition', 'Diagram'],
  	controllers : ['Menu', 'Pallete', 'Canvas'],
	views : ['Menu'],
	useWorker : typeof(Worker) !== "undefined",	
	useWebDB : !!window.openDatabase,
	
	/**
	 * 현재 선택된 HatioCanvas를 찾아 리턴 
	 */
	currentCanvas : function() {		
		var activeItem = this.currentCanvasTab();
		
		if(!activeItem) {
			return null;
		} else {
			var hatioCanvas = activeItem.getHatioCanvas();
			return hatioCanvas;
		}
	},
	
	/**
	 * 현재 선택된 CanvasTab을 찾아 리턴 
	 */	
	currentCanvasTab : function() {
		var content = Ext.getCmp('content');
		return content.layout.getActiveItem();
	},
	
	/**
	 * 다이어그램이 이미 오픈 되어 있는지 확인  
	 */
	diagramAlreadyOpen : function(diagramId) {
		if(!diagramId) {
			return false;
		}
		
		var content = Ext.getCmp('content');
		var items = content.layout.getLayoutItems();
		var alreayOpened = false;
		
		Ext.each(items, function(item) {
			if(diagramId == item.getDiagramId()) {
				alreayOpened = true;
				return false;
			}
		});
		
		return alreayOpened;
	},
	
	/**
	 * diagramId로 오픈 되어 있는 CanvasTab을 찾아 리턴
	 */	
	findCanvasTab : function(diagramId) {
		if(!diagramId) {
			return false;
		}
		
		var content = Ext.getCmp('content');
		var items = content.layout.getLayoutItems();
		var targetItem = null;
		
		Ext.each(items, function(item) {
			if(diagramId == item.getDiagramId()) {
				targetItem = item;
				return false;
			}
		});
		
		return targetItem;
	},	
	
	launch : function() {
		Designer.app = this;
				
		if(this.useWorker) {
			this.echoWorker = new Worker('app/worker/EchoWorker.js');
			this.echoWorker.onerror = function(event) {
				Ext.Msg.alert('Error', "Occurred At EchoWorker : " + event.message);
			};
		} else {
			Ext.Msg.alert("Alert", "This browser is not support web worker");
		}
		
		if(this.useWebDB) {
			this.db = window.openDatabase("HatioDesigner", "0.1", "description", 5*1024*1024);
			this.db.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS DIAGRAMS (id integer primary key autoincrement, user_id, title, content, updated_at)');
				//tx.executeSql('DROP TABLE DIAGRAMS');
			});
		} else {
			Ext.Msg.alert("Alert", "This browser is not support web database");
		}
		
		Designer.app.eventbus.addEvents({
			addcanvas : true,
			changecanvas : true,
			cooperrequest : true,
			palleteLoad : true
		});
		
		Ext.create('Designer.view.Viewport');
	},
	
	progressStart : function(){
		Ext.MessageBox.show({
           title: 'Please wait',
           msg: 'Loading items...',
           progressText: 'Initializing...',
           width:300,
           progress:true,
           closable:false,
       });
        // setTimeout(function(){
            // //This simulates a long-running operation like a database save or XHR call.
            // //In real code, this would be in a callback function.
            // Ext.MessageBox.hide();
        // }, 8000);
        // var f = function(v){
            // return function(){
                // if(v == 12){
                    // Ext.MessageBox.hide();
                // }else{
                    // var i = v/11;
                    // Ext.MessageBox.updateProgress(i, Math.round(100*i)+'% completed');
                // }
           // };
       // };
       // for(var i = 1; i < 13; i++){
           // setTimeout(f(i), i*280);
       // }
	},
	
	progressEnd : function(){
		Ext.MessageBox.hide();
	}
});

