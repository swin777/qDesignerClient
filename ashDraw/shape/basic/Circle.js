define(["dojo/_base/declare", "ashDraw/shape/basic/Oval"], function(declare){
	return declare("ashDraw.shape.basic.Circle", ashDraw.shape.basic.Oval, {
	    NAME: "ashDraw.shape.basic.Circle",
	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(radius) {
	    	this.inherited(arguments);
	        if (typeof radius === "number") {
	            this.setDimension(radius, radius);
	        } else {
	            this.setDimension(40, 40);
	        }
	    },

	    setDimension: function(w, h) {
	        if (w > h) {
	            this.inherited(arguments, [w, w]);
	        } else {
	            this.inherited(arguments, [h, h]);
	        }
	    },

	    isStrechable: function() {
	        return false;
	    }
	});
});