dojo.declare("ashDraw.SetFigure", ashDraw.shape.basic.Rectangle, {
    NAME: "ashDraw.SetFigure",

    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function(width, height) {
        this.svgNodes = null;

        this.originalWidth = null;
        this.originalHeight = null;

        this.scaleX = 1;
        this.scaleY = 1;

        this.offsetX = 0;
        this.offsetY = 0;

        this.inherited(arguments, [width, height]);
        
        this.setStroke(0);
        this.setBackgroundColor(null);
    },

    setCanvas: function(canvas) {
        // remove the shape if we reset the canvas and the element
        // was already drawn
        if (canvas === null && this.svgNodes !== null) {
            this.svgNodes.remove();
            this.svgNodes = null;
        }

        this.inherited(arguments, [canvas]);
    },

    repaint: function(attributes) {
        // repaint can be blocked during deserialization and if the shape
        // not part of any canvas.
        //
        if (this.repaintBlocked === true || this.shape === null) {
            return;
        }

        if (this.originalWidth !== null) {
            this.scaleX = this.width / this.originalWidth;
            this.scaleY = this.height / this.originalHeight;
        }

        if (typeof attributes === "undefined") {
            attributes = {};
        }
        if (this.svgNodes !== null) {
            if (this.automaticResizeInnerContent() === true && this.isResizeable() === true) {
                this.svgNodes.transform("s" + this.scaleX + "," + this.scaleY + "," + this.getAbsoluteX() + "," + this.getAbsoluteY() + " t" + (this.getAbsoluteX() - this.offsetX) + "," + (this.getAbsoluteY() - this.offsetY));
            } else {
                this.svgNodes.transform("t" + (this.getAbsoluteX() - this.offsetX) + "," + (this.getAbsoluteY() - this.offsetY));
            }

            if (this.rotationAngle !== 0) {
                var bb = this.svgNodes.getBBox();
                //                this.svgNodes.transform("...r"+this.rotationAngle+"," + (bb.width/2+this.padding) + "," + (bb.height/2+this.padding));
                this.svgNodes.transform("r" + this.rotationAngle + "," + (bb.width / 2 + this.padding + this.getAbsoluteX()) + "," + (bb.height / 2 + this.padding + this.getAbsoluteY() + "..."));
            }
        }

        if (this.visible === true) {
            this.svgNodes.show();
        } else {
            this.svgNodes.hide();
        }

        this.inherited(arguments, [attributes]);
    },

    automaticResizeInnerContent: function() {
        return true;
    },

    createShapeElement: function() {
        var shape = this.canvas.paper.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        this.svgNodes = this.createSet();

        var bb = this.svgNodes.getBBox();
        this.originalWidth = bb.width;
        this.originalHeight = bb.height;

        this.offsetX = bb.x;
        this.offsetY = bb.y;

        return shape;
    },

    createSet: function() {
        return this.canvas.paper.set();
    }
});