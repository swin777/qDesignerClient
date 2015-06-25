define(["dojo/_base/declare", "ashDraw/layout/locator/Locator"], function(declare){
	return declare("ashDraw.layout.locator.PortLocator", ashDraw.layout.locator.Locator, {
	    NAME : "ashDraw.layout.locator.PortLocator",
	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(){
	    	this.inherited(arguments);
	    },
	});
});