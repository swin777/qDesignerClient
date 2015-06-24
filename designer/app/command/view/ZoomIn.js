/**
 * Edit ZoomIn Command 
 */
Ext.define('Designer.command.view.ZoomIn', {	
    
	text : 'ZoomIn',
	
  	init: function() {
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(hatioCanvas) 
	    	hatioCanvas.setZoom(hatioCanvas.getZoom() * 1.1);
	}
});