dojo.declare("ashDraw.shape.basic.Diamond", ashDraw.VectorFigure, {
    NAME: "ashDraw.shape.basic.Diamond",
    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function(width, height) {
    	this.inherited(arguments);
        this.setBackgroundColor(new ashDraw.util.Color(100, 100, 150));
        this.setColor(new ashDraw.util.Color(50, 50, 50));

        if (typeof width === "undefined") {
            this.setDimension(50, 90);
        } else {
            this.setDimension(width, height);
        }
    },

    repaint: function(attributes) {
        if (this.repaintBlocked === true || this.shape === null) {
            return;
        }

        if (typeof attributes === "undefined") {
            attributes = {};
        }

        var box = this.getBoundingBox();
        var path = ["M", box.x + (box.w / 2), " ", box.y];
        path.push("L", box.x + box.w, " ", box.y + box.h / 2);
        path.push("L", box.x + box.w / 2, " ", box.y + box.h);
        path.push("L", box.x, " ", box.y + box.h / 2);
        path.push("L", box.x + box.w / 2, " ", box.y);
        attributes.path = path.join("");

        this.inherited(arguments, [attributes]);
    },

    createShapeElement: function() {
        return this.canvas.paper.path("M0 0L1 1");
    }
});