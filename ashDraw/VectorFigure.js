dojo.declare("ashDraw.VectorFigure", ashDraw.shape.node.Node, {
    NAME: "ashDraw.VectorFigure",
    
    "-chains-": {
        constructor: "manual"
    },
    constructor: function(){
    	 this.bgColor = new ashDraw.util.Color(100, 100, 100);
         this.color = new ashDraw.util.Color(0, 0, 0);
         this.stroke = 1;
         this.strokeBeforeGlow = this.stroke;
         this.glowIsActive = false;
         this.inherited(arguments);
    },
    
//    constructor: function() {
//    	this.init();
//    },
//
//    init: function() {
//        this.bgColor = new ashDraw.util.Color(100, 100, 100);
//        this.color = new ashDraw.util.Color(0, 0, 0);
//        this.stroke = 1;
//        this.strokeBeforeGlow = this.stroke;
//        this.glowIsActive = false;
//        this.inherited(arguments);
//    },

    setGlow: function(flag) {
        if (flag === this.glowIsActive) {
            return;
        }

        this.glowIsActive = flag;
        if (flag === true) {
            this.strokeBeforeGlow = this.getStroke();
            this.setStroke(this.strokeBeforeGlow * 2.5);
        } else {
            this.setStroke(this.strokeBeforeGlow);
        }
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

        if (typeof attributes.stroke === "undefined") {
            if (this.color === null || this.stroke === 0) {
                attributes.stroke = "none";
            } else {
                attributes.stroke = "#" + this.color.hex();
            }
        }

        attributes["stroke-width"] = this.stroke;

        if (typeof attributes.fill === "undefined") {
            if (this.bgColor !== null) {
                attributes.fill = "#" + this.bgColor.hex();
            } else {
                attributes.fill = "none";
            }
        }

        this.inherited(arguments, [attributes]);
    },

    setBackgroundColor: function(color) {
        if (color instanceof ashDraw.util.Color) {
            this.bgColor = color;
        } else if (typeof color === "string") {
            this.bgColor = new ashDraw.util.Color(color);
        } else {
            this.bgColor = null;
        }

        this.repaint();
    },

    getBackgroundColor: function() {
        return this.bgColor;
    },

    setStroke: function(w) {
        this.stroke = w;
        this.repaint();
    },

    getStroke: function() {
        return this.stroke;
    },

    setColor: function(color) {
        if (color instanceof ashDraw.util.Color) {
            this.color = color;
        } else if (typeof color === "string") {
            this.color = new ashDraw.util.Color(color);
        } else {
            this.color = new ashDraw.util.Color(0, 0, 0);
        }
        this.repaint();
    },

    getColor: function() {
        return this.color;
    }
});