Ext.define('Designer.view.Outline', {

	extend : 'Ext.panel.Panel',

	alias : 'widget.outline',
	
	id : 'outline',
	
	title : 'Outline',
	
	autoScroll : false,
	
	echoWorkerFilterStr : 'export_png',
			
	html :   '<div style="position:relative; width:100%; height:100%;">'+
			 	'<div id="outLineDiv" style="position:absolute; overflow:hidden; width:100%; height:100%;"></div>'+
			 	'<div id="viewDiv" style="position:absolute; border-width:0px; border-style:dashed; border-color:#9E032F; width:100%; height:100%;"></div>'+
  			 '</div>',
	
	repaint : function(hatioCanvas, command) {
		if(!hatioCanvas)
			hatioCanvas = command.figure.getCanvas();
		
		if(hatioCanvas)
			this.exportPng(hatioCanvas);
		this.outLineDivWidth = $("#outLineDiv").width();
		this.outLineDivHeight = $("#outLineDiv").height();
		this.viewWidth = $("#viewDiv").width();
		this.viewHeight = $("#viewDiv").height();
		this.viewDivObj = $("#viewDiv");
		var self = this;
		$('#viewDiv').bind('drag',function( event ){
        	Designer.app.currentCanvas().html.parent().scrollLeft(self.viewDivObj.css("left").replace("px", "")*(1/self.g_rate));
        	Designer.app.currentCanvas().html.parent().scrollTop(self.viewDivObj.css("top").replace("px", "")*(1/self.g_rate));
        });
        $('#viewDiv').mousedown(function( event ){
        	Designer.app.currentCanvas().html.parent().off('scroll');
        });
        $('#viewDiv').mouseup(function( event ){
        	Designer.app.currentCanvas().html.parent().scroll('scroll', function() {
				self.viewDivObj.css("left", Designer.app.currentCanvas().html.parent().scrollLeft()*self.g_rate  );
				self.viewDivObj.css("top", Designer.app.currentCanvas().html.parent().scrollTop()*self.g_rate );
			});
        });
        $('#viewDiv').mouseout(function( event ){
        	Designer.app.currentCanvas().html.parent().scroll('scroll', function() {
				self.viewDivObj.css("left", Designer.app.currentCanvas().html.parent().scrollLeft()*self.g_rate  );
				self.viewDivObj.css("top", Designer.app.currentCanvas().html.parent().scrollTop()*self.g_rate );
			});
        });
        Designer.app.currentCanvas().html.parent().on('scroll', function() {
			self.viewDivObj.css("left", Designer.app.currentCanvas().html.parent().scrollLeft()*self.g_rate  );
			self.viewDivObj.css("top", Designer.app.currentCanvas().html.parent().scrollTop()*self.g_rate );
		});
	},
	
	exportPng : function(hatioCanvas) {
		hatioCanvas = Designer.app.currentCanvas();
		var svg = hatioCanvas.getHtmlContainer().html().replace(/>\s+/g, ">").replace(/\s+</g, "<");
		svg = svg.substring(0,4) + ' ' + ' xmlns:xlink="http://www.w3.org/1999/xlink" ' + svg.substring(5);
		if(!svg.match("xlink:href=")){
			svg = svg.split("href=").join("xlink:href=");	
		}
		$("#outLineDiv").html(svg);
		var figureAreaPostion = hatioCanvas.figureAreaPostion();
		var wRate = 1;
		var hRate = 1;
		if(figureAreaPostion.maxX!=0){
			if(figureAreaPostion.minX < hatioCanvas.getWidth()){
				wRate = Math.sqrt(Math.pow($("#outLineDiv").parent().css("width").replace("px", ""),2)/Math.pow(figureAreaPostion.maxX+figureAreaPostion.minX,2));	
			}else{
				wRate = Math.sqrt(Math.pow($("#outLineDiv").parent().css("width").replace("px", ""),2)/Math.pow(figureAreaPostion.maxX+20,2));
			}
		}
		if(figureAreaPostion.maxY!=0){
			if(figureAreaPostion.minY < hatioCanvas.getHeight()){
				hRate = Math.sqrt(Math.pow($("#outLineDiv").parent().css("height").replace("px", ""),2)/Math.pow(figureAreaPostion.maxY+figureAreaPostion.minY,2));
			}else{
				hRate = Math.sqrt(Math.pow($("#outLineDiv").parent().css("height").replace("px", ""),2)/Math.pow(figureAreaPostion.maxY+20,2));
			}
		}
		var rate = Math.min(hRate, wRate);
		this.g_rate = rate;
		if(rate<1){
			$("#outLineDiv").css("overflow","hidden");
			$('#outLineDiv').css('-webkit-transform','scale(' + (rate) + ')');
			$('#outLineDiv').css('-webkit-transform-origin','0 0');
			$('#outLineDiv').css('-moz-transform','scale(' + (rate) + ')');
			$('#outLineDiv').css('-moz-transform-origin','0 0');
			$('#outLineDiv').css('-o-transform','scale(' + (rate) + ')');
			$('#outLineDiv').css('-o-transform-origin','0 0');
			$("#outLineDiv").css("width", this.outLineDivWidth*(1/rate));
			$("#outLineDiv").css("height", this.outLineDivHeight*(1/rate));
			$("#viewDiv").css("border-width","1px");
			$("#viewDiv").css("-webkit-box-shadow","rgba(100, 100, 100, 0.498039) 0px 0px 0px 9000px");
			
			$("#viewDiv").draggable();
			
			var viewRateX = hatioCanvas.html.parent().width()/figureAreaPostion.maxX;	
			var viewRateY = hatioCanvas.html.parent().height()/figureAreaPostion.maxY;
			if(viewRateX<1){
				$("#viewDiv").css("width", (hatioCanvas.html.parent().width()-15) * rate);
			}else{
				$("#viewDiv").css("width", "100%");
			}				
			if(viewRateY<1){
				$("#viewDiv").css("height", (hatioCanvas.html.parent().height()-15) * rate);
			}else{
				$("#viewDiv").css("height", "100%");
			}
		}else{
			$("#viewDiv").css("left","0px");
			$("#viewDiv").css("top","0px");
			$("#viewDiv").css("border-width","0px");
			$("#viewDiv").css("left","0px");
			$("#viewDiv").css("top","0px");
		}
	},
	
	initComponent : function() {
		var self = this;
		this.callParent(arguments);
		
		if(Designer.app.useWorker) {
			Designer.app.echoWorker.onmessage = function(event) {
				if(event.data == self.echoWorkerFilterStr) {
					var hatioCanvas = Designer.app.currentCanvas();
					if(hatioCanvas) {
						self.exportPng(hatioCanvas);
					}
				}
			};
		}
		
		Designer.app.eventbus.on('addcanvas', function(hatioCanvas) {
			hatioCanvas.getCommandStack().addEventListener(this);
		}, this);
		
		Designer.app.eventbus.on('changecanvas', function(hatioCanvas) {
			if(hatioCanvas) {
				this.repaint(hatioCanvas, null);
			} else {
				$("#outLineDiv").html('');
			}
		}, this);
		
		Designer.app.eventbus.on('labelViewToogle', function(hatioCanvas) {
			self.exportPng(hatioCanvas);
		}, this);
		
		Designer.app.eventbus.on('autoLayout', function(hatioCanvas) {
			self.exportPng(hatioCanvas);
		}, this);
	},
		
	stackChanged : function(event) {
		if(event.isPreChangeEvent())
			return;
		// WebWorker를 지원하지 않으면 동기 처리 
		if(!Designer.app.useWorker) {
			this.repaint(event.command.canvas, event.command);
		// WebWorker를 지원하면 비동기 처리, TODO 현재 백그라운드 처리는 아님 --> 백그라운드 처리를 할 수 있는 방안 ....
		} else {
			if(event.command && (event.command.canvas || (event.command.figure && event.command.figure.getCanvas()))) {
				Designer.app.echoWorker.postMessage(this.echoWorkerFilterStr);
			}
		}
	},
	
	listeners : {
		resize : function(panel, width, height, oldWidth, oldHeight, eOpts) {
			var hatioCanvas = Designer.app.currentCanvas();
			if(hatioCanvas){
				panel.repaint(hatioCanvas, null);
			}
		}
	}

});