define(["dojo/_base/declare", "ashDraw/VectorFigure", "ashDraw/util/Color"], function(declare){
	return declare("ashDraw.shape.basic.Oval", ashDraw.VectorFigure, {
	    NAME: "ashDraw.shape.basic.Oval",
	    "-chains-": {
	        constructor: "manual"
	    },
	   
	    constructor: function(width, height) {
	    	this.inherited(arguments);
	        this.setBackgroundColor(new ashDraw.util.Color(200, 255, 120));

	        if ((typeof height === "number") && (typeof width === "number")) {
	            this.setDimension(width, height);
	        } else {
	            this.setDimension(50, 50);
	        }
	    },

	    createShapeElement: function() {
	        var halfW = this.getWidth() / 2;
	        var halfH = this.getHeight() / 2;
	        return this.canvas.paper.ellipse(this.getAbsoluteX() + halfW, this.getAbsoluteY() + halfH, halfW, halfH);
	    },

	    repaint: function(attributes) {
	        if (this.repaintBlocked === true || this.shape === null) {
	            return;
	        }

	        if (typeof attributes === "undefined") {
	            attributes = {};
	        }

	        if (typeof attributes.rx === "undefined") {
	            attributes.rx = this.width / 2;
	            attributes.ry = this.height / 2;
	        }

	        if (typeof attributes.cx === "undefined") {
	            attributes.cx = this.getAbsoluteX() + attributes.rx;
	            attributes.cy = this.getAbsoluteY() + attributes.ry;
	        }

	        this.inherited(arguments, [attributes]);
	    }
	});
});