define(["dojo/_base/declare", "ashDraw/layout/locator/Locator"], function(declare){
	return declare("ashDrawEx.MyInputPortLocator", ashDraw.layout.locator.Locator, {
		"-chains-": {
	        constructor: "manual"
	    },
		constructor: function() {
			this.inherited(arguments);
	    },
	    
		relocate:function(index, figure) {
			var w = figure.getParent().getWidth();
			var h = figure.getParent().getHeight();
			figure.setPosition(w / 2 + 1, h * index);
		}
	});
});