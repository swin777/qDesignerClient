/**
 * Option Grid Command 
 */
Ext.define('Designer.command.option.Grid', {	
    
	text : 'Grid',
	
	reexcutable : false,
	
  	init: function() {
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(hatioCanvas) 
	    	hatioCanvas.setGrid();
	}
});