/**
 * Edit ZoomOut Command 
 */
Ext.define('Designer.command.view.ZoomOut', {
    
	text : 'ZoomOut',
	
  	init: function() {
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(hatioCanvas)
	    	hatioCanvas.setZoom(hatioCanvas.getZoom() * 0.9);
	}
});