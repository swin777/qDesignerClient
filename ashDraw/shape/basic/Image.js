define(["dojo/_base/declare", "ashDraw/shape/node/Node"], function(declare){
	return declare("ashDraw.shape.basic.Image", ashDraw.shape.node.Node, {
	    NAME: "ashDraw.shape.basic.Image",
	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(path, width, height) {
	    	this.inherited(arguments, [width, height]);
	        this.path = path;
	    },

	    repaint: function(attributes) {
	        if (this.repaintBlocked === true || this.shape === null) {
	            return;
	        }

	        if (typeof attributes === "undefined") {
	            attributes = {};
	        }

	        attributes.x = this.getAbsoluteX();
	        attributes.y = this.getAbsoluteY();
	        attributes.width = this.getWidth();
	        attributes.height = this.getHeight();

	        this.inherited(arguments, [attributes]);
	    },

	    createShapeElement: function() {
	        return this.canvas.paper.image(this.path, this.getX(), this.getY(), this.getWidth(), this.getHeight());
	    }
	});
});