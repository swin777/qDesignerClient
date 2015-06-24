/**
 * Edit ActualSize Command 
 */
Ext.define('Designer.command.view.ActualSize', {	
    
	text : 'ActualSize',
	
  	init: function() {
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(hatioCanvas) 
	    	hatioCanvas.setZoom(1.0);
	}
});