Ext.define('Designer.controller.Canvas', {
	extend : 'Ext.app.Controller',
		
	views : [ 'Designer.view.Canvas' ],
			
	refs : [ {
		ref : 'canvas',
		selector : 'canvas'
	} ],
    
	init : function() {
		this.control({
			'canvas': {
				activate: this.onCanvasActivate,
				destroy: this.onCanvasDestroy
			}
		});
	},
    
	onCanvasActivate : function(canvas, eOpts) {
		// TODO
	},
	
	onCanvasDestroy : function(canvas, eOpts) {
		// TODO
	}
});