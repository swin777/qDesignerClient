/**
 * Option Direct Command 
 */
Ext.define('Designer.command.connectType.Direct', {	
    
	text : 'Direct',
	
	reexcutable : false,
	
  	init: function() {
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(hatioCanvas) 
	    	hatioCanvas.setConnectType("DirectRouter");
	}
});