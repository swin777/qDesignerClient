/**
 * Option Manhattan Command 
 */
Ext.define('Designer.command.connectType.Manhattan', {	
    
	text : 'Manhattan',
	
	reexcutable : false,
	
  	init: function() {
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(hatioCanvas) 
	    	hatioCanvas.setConnectType("ManhattanBridgedConnectionRouter");
	}
});