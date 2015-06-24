Ext.define('Designer.view.ShapePropertyEditor', {

	extend : 'Ext.grid.property.Grid',

	alias : 'widget.shape_property_editor',
	
	id : 'shape_property_editor',
		
	title : 'Shape Properties',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	initComponent : function() {
		var self = this;
		this.figure = null;
		this.source = {};
		
		Designer.app.eventbus.on('addcanvas', function(hatioCanvas) {
			this.setSource({});
			hatioCanvas.addSelectionListener(this);
			hatioCanvas.getCommandStack().addEventListener(this);
		}, this);
		
		this.on('propertychange', function(source, recordId, value, oldValue, eOpts) {
			if(value != oldValue) {
				var hatioCanvas = Designer.app.currentCanvas();
				if("x"==recordId || "y"==recordId){
					var command = new ashDraw.command.CommandMove(self.figure);
					command.setPosition(source.x, source.y);
					hatioCanvas.getCommandStack().execute(command);
				}else if("width"==recordId || "height"==recordId){
					var command = new ashDraw.command.CommandResize(self.figure);
					command.setDimension(source.width, source.height);
					hatioCanvas.getCommandStack().execute(command);
				}else if("label"==recordId){
					//self.figure.setLabel(source.label);
					var command = new ashDraw.command.CommandReLabel(self.figure);
					command.setLabel(source.label);
					hatioCanvas.getCommandStack().execute(command);
				}
				//self.figure.setPersistentAttributes(source);
				//self.figure.repaint(source);
				//self.figure.fireMoveEvent();
				hatioCanvas.setCurrentSelection(this.figure);
			}
		});
		this.callParent(arguments);
	},
	
	stackChanged : function(event) {
		if(event.isPreChangeEvent())
			return;
		var figure = event.command.figure;
		if(typeof figureArr == 'undefined') {
			if(figure === null || typeof figure == "undefined") {
				this.setSource({});
			} else {
				var attrs = figure.getPersistentAttributes();
				this.setSource(attrs);
				this.figure = figure;
			}
		}
	},
	
	onSelectionChanged : function(figure, figureArr) {
		// single selection
		if(typeof figureArr == 'undefined') {
			if(figure === null || typeof figure == "undefined") {
				this.setSource({});
			} else {
				var attrs = figure.getPersistentAttributes();
				this.setSource(attrs);
				this.figure = figure;
			}
		}
	}	
});