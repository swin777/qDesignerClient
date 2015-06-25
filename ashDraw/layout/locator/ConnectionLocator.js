define(["dojo/_base/declare", "ashDraw/layout/locator/Locator"], function(declare){
	return declare("ashDraw.layout.locator.ConnectionLocator", ashDraw.layout.locator.Locator, {
	    NAME : "ashDraw.layout.locator.ConnectionLocator",
	    "-chains-": {
	        constructor: "manual"
	    },
		
		constructor: function(parentShape){
			this.inherited(arguments);
		},
	});
});