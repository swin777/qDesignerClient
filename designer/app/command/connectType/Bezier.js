/**
 * Option Bezier Command 
 */
Ext.define('Designer.command.connectType.Bezier', {	
    
	text : 'Bezier',
	
	reexcutable : false,
	
  	init: function() {
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(hatioCanvas) 
	    	hatioCanvas.setConnectType("BezierConnectionRouter");
	}
});