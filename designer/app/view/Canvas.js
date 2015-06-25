Ext.define('Designer.view.Canvas', {

	extend : 'Ext.panel.Panel',
	
	alias : 'widget.canvas',
		
	closable : true,
	
	autoScroll : true,
	
	diagramDefinitionId : null,
	
	diagramId : null, 
	
	diagramVersion : -1,
	
	initComponent : function() {
		this.canvasId = 'canvas_' + Ext.Date.now();
		// TODO div size 계산 후 ....
		this.html = "<div id='" + this.canvasId + "' class='canvas' style='width:1500px; height:1500px;-webkit-tap-highlight-color: rgba(0,0,0,0);'></div>";
		this.callParent(arguments);
	},	
	
	createExCanvas : function(diagramContent) {
		// TODO 이 부분에서 플러그 인 구현 
		var self = this;
		this.canvas = new ashDrawEx.ExCanvas(this.canvasId);
		Designer.app.eventbus.fireEvent('addcanvas', this.canvas);
		
		if(diagramContent) {
			var reader = new ashDraw.io.json.Reader();		
			reader.unmarshal(this.canvas, Ext.JSON.decode(diagramContent));
		}
		
		Designer.app.eventbus.on('palleteLoad', function() {
			self.canvas.reDragAbleReg();
		}, this);
		Designer.app.eventbus.fireEvent('changecanvas', this.canvas);
		this.canvas.setGrid(true);
	},
	
	getCanvasId : function() {
		return this.canvasId;
	},
	
	getHatioCanvas : function() {
		return this.canvas;
	},

	getDiagramDefinitionId : function() {
		return this.diagramDefinitionId;
	},
	
	setDiagramDefinitionId : function(diagramDefinitionId) {
		this.diagramDefinitionId = diagramDefinitionId;
	},
		
	getDiagramId : function() {
		return this.diagramId;
	},
	
	setDiagramId : function(diagramId) {
		this.diagramId = diagramId;
	},
	
	getDiagramVersion : function() {
		return this.diagramVersion;
	},
	
	setDiagramVersion : function(diagramVersion) {
		this.diagramVersion = diagramVersion;
	}
});