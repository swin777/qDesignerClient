define(["dojo/_base/declare"], function(declare){
	return declare("ashDraw.decoration.connection.Decorator", null, {
	    NAME: "ashDraw.decoration.connection.Decorator",

	    constructor: function(width, height) {
	        if (typeof width === "undefined" || width < 1)
	            this.width = 20;

	        if (typeof height === "undefined" || height < 1)
	            this.height = 15;

	        this.color = new ashDraw.util.Color(0, 0, 0);
	        this.backgroundColor = new ashDraw.util.Color(250, 250, 250);
	    },

	    paint: function(paper) {},

	    setColor: function(c) {
	        this.color = c;
	    },

	    setBackgroundColor: function(c) {
	        this.backgroundColor = c;
	    },

	    setDimension: function(width, height) {
	        this.width = width;
	        this.height = height;
	    }
	});
});