define(["dojo/_base/declare", "ashDraw/shape/node/Node"], function(declare){
	return declare("ashDrawEx.shape.node.basic.Image", ashDraw.shape.node.Node, {
	    NAME: "ashDrawEx.shape.node.basic.Image",

	    "-chains-": {
	        constructor: "manual"
	    },
	    constructor: function(width, height) {
	    	if (!width)
	            width = 50;

	        if (!height)
	            height = 50;

	        this.inherited(arguments, [width, height]);
	        this.path = '/dynagram/resources/images/designer/notation/default/default-node.png';

	        this.createPort("input");
	        this.createPort("output");
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
	        attributes.path = this.path;

	        this.inherited(arguments, [attributes]);
	    },

	    createShapeElement: function() {
	        return this.canvas.paper.image(this.path, this.getX(), this.getY(), this.getWidth(), this.getHeight());
	    },

	    getPersistentAttributes: function() {
	        var memento = {
	            type: this.NAME,
	            id: this.id,
	            x: this.x,
	            y: this.y,
	            width: this.width,
	            height: this.height,
	            path: this.path,
	            gId: this.gId,
	            dx: this.dx,
	            dy: this.dy
	        };

	        return memento;
	    },

	    setPersistentAttributes: function(memento) {
	        this.id = memento.id;
	        this.x = memento.x;
	        this.y = memento.y;
	        this.path = memento.path;
	        this.gId = memento.gId;
	        this.dx = memento.dx;
	        this.dy = memento.dy;

	        if (typeof memento.width !== "undefined") {
	            this.width = memento.width;
	        }

	        if (typeof memento.height !== "undefined") {
	            this.height = memento.height;
	        }
	    }
	});
});