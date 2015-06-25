define(["dojo/_base/declare", "ashDraw/SetFigure", "ashDraw/util/Color"], function(declare){
	return declare("ashDraw.shape.basic.Label", ashDraw.SetFigure, {
	    NAME: "ashDraw.shape.basic.Label",
	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(text) {
	    	this.inherited(arguments);
	        if (typeof text === "string") {
	            this.text = text;
	        } else {
	            this.text = "";
	        }

	        this.fontSize = 12;
	        this.fontColor = new ashDraw.util.Color("#080808");
	        this.padding = 4;
	        this.setStroke(1);
	        this.editor = null;
	    },

	    createSet: function() {
	        return this.canvas.paper.text(0, 0, this.text);
	    },

	    repaint: function(attributes) {
	        if (this.repaintBlocked === true || this.shape === null) {
	            return;
	        }

	        if (typeof attributes === "undefined") {
	            attributes = {};
	        }


	        var lattr = {};
	        lattr.text = this.text;
	        lattr.x = this.padding;
	        lattr.y = this.getHeight() / 2;
	        lattr["text-anchor"] = "start";
	        lattr["font-size"] = this.fontSize;
	        lattr.fill = "#" + this.fontColor.hex();
	        this.svgNodes.attr(lattr);

	        this.offsetX = 0;
	        this.offsetY = 0;

	        this.inherited(arguments, [attributes]);
	    },

	    isResizeable: function() {
	        return false;
	    },

	    setFontSize: function(size) {
	        this.fontSize = size;
	        this.repaint();
	    },

	    setFontColor: function(color) {
	        if (color instanceof ashDraw.util.Color) {
	            this.fontColor = color;
	        } else if (typeof color === "string") {
	            this.fontColor = new ashDraw.util.Color(color);
	        } else {
	            this.fontColor = new ashDraw.util.Color(0, 0, 0);
	        }
	        this.repaint();
	    },

	    getFontColor: function() {
	        return this.fontColor;
	    },

	    setPadding: function(padding) {
	        this.padding = padding;
	        this.repaint();
	    },

	    setDimension: function( /*:int*/ w, /*:int*/ h) {},

	    getMinWidth: function() {
	        return this.getWidth();
	    },

	    getMinHeight: function() {
	        return this.getHeight();
	    },

	    installEditor: function(editor) {
	        this.editor = editor;
	    },

	    onDoubleClick: function() {
	        if (this.editor !== null) {
	            this.editor.start(this);
	        }
	    },

	    getText: function() {
	        return this.text;
	    },

	    setText: function( /*:String*/ text) {
	        this.text = text;

	        this.repaint();
	    },

	    getWidth: function() {
	        if (this.shape === null) {
	            return 0;
	        }
	        return this.svgNodes.getBBox().width + 2 * this.padding;
	    },

	    getHeight: function() {
	        if (this.shape === null) {
	            return 0;
	        }
	        return this.svgNodes.getBBox().height + 2 * this.padding;
	    }
	});
});