define(["dojo/_base/declare", "ashDraw/shape/basic/Circle", "ashDraw/util/Color"], function(declare){
	return declare("ashDraw.Corona", ashDraw.shape.basic.Circle, {
		"-chains-": {
	        constructor: "manual"
	    },
	    constructor: function() {
	    	this.inherited(arguments);
	        this.setAlpha(0.3);
	        this.setBackgroundColor(new ashDraw.util.Color(178, 225, 255));
	        this.setColor(new ashDraw.util.Color(102, 182, 252));
	    },

	    setAlpha: function(percent) {
	        this.inherited(arguments, [Math.min(0.3, percent)]);
	        this.setDeleteable(false);
	        this.setDraggable(false);
	        this.setResizeable(false);
	        this.setSelectable(false);
	    }
	});
});