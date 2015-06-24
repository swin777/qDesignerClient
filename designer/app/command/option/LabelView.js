/**
 * Option ToManager Command 
 */
Ext.define('Designer.command.option.LabelView', {	
    
	text : 'LabelView',
	
	reexcutable : false,
	
  	init: function() {
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(hatioCanvas) 
	    	hatioCanvas.labelViewToogle();
	    	
	    Designer.app.eventbus.fireEvent('labelViewToogle');
	}
});