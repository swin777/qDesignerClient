dojo.declare("ashDraw.shape.basic.Rectangle", ashDraw.VectorFigure, {
    NAME: "ashDraw.shape.basic.Rectangle",
    
    "-chains-": {
        constructor: "manual"
    },
    constructor: function(width, height){
    	this.radius = 2;
        this.inherited(arguments, [width, height]);
        this.setBackgroundColor(new ashDraw.util.Color(100, 100, 100));
        this.setColor(new ashDraw.util.Color(50, 50, 50));

        if (typeof width === "undefined" || isNaN(width)) {
            this.setDimension(50, 90);
        } else {
            this.setDimension(width, height);
        }
    },

//    constructor: function(width, height) {
//    	this.init(width, height);
//    },
//    
//    init: function(width, height) {
//        this.radius = 2;
//        this.inherited(arguments);
//        this.setBackgroundColor(new ashDraw.util.Color(100, 100, 100));
//        this.setColor(new ashDraw.util.Color(50, 50, 50));
//
//        if (typeof width === "undefined" || isNaN(width)) {
//            this.setDimension(50, 90);
//        } else {
//            this.setDimension(width, height);
//        }
//    },

    repaint: function(attributes) {
        if (this.repaintBlocked === true || this.shape === null) {
            return;
        }

        if (typeof attributes === "undefined") {
            attributes = {};
        }

        attributes.width = this.getWidth();
        attributes.height = this.getHeight();
        attributes.r = this.radius;
        this.inherited(arguments, [attributes]);
    },

    createShapeElement: function() {
        return this.canvas.paper.rect(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight());
    },

    setRadius: function(radius) {
        this.radius = radius;
        this.repaint();
    },

    getRadius: function() {
        return this.radius;
    },

    getPersistentAttributes: function() {
        var memento = this.inherited(arguments);

        memento.radius = this.radius;

        return memento;
    },

    setPersistentAttributes: function(memento) {
        this.inherited(arguments, [memento]);

        if (typeof memento.radius === "number") {
            this.radius = memento.radius;
        }
    }
});