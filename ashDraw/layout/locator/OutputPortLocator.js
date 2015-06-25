define(["dojo/_base/declare", "ashDraw/layout/locator/Locator"], function(declare){
	return declare("ashDraw.layout.locator.OutputPortLocator", ashDraw.layout.locator.Locator, {
	    NAME : "ashDraw.layout.locator.OutputPortLocator",
	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(){
	    	this.inherited(arguments);
	    },
	   
	    relocate:function(index, figure){
	        var node = figure.getParent();
	        var w = node.getWidth();
	        var h = node.getHeight();
	        var gap = h/(node.getOutputPorts().getSize()+1);
	        figure.setPosition(w, gap*(index+1));
	    }
	});
});