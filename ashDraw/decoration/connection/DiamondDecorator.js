define(["dojo/_base/declare", "ashDraw/decoration/connection/Decorator"], function(declare){
	return declare("ashDraw.decoration.connection.DiamondDecorator", ashDraw.decoration.connection.Decorator, {
	    NAME: "ashDraw.decoration.connection.DiamondDecorator",

	    "-chains-": {
	        constructor: "manual"
	    },
	    constructor: function(width, height) {
	    	this.inherited(arguments, [width, height]);
	    },

	    paint: function(paper) {
	        var st = paper.set();
	        var path = ["M", this.width / 2, " ", -this.height / 2];
	        path.push("L", this.width, " ", 0);
	        path.push("L", this.width / 2, " ", this.height / 2);
	        path.push("L", 0, " ", 0);
	        path.push("L", this.width / 2, " ", -this.height / 2);
	        path.push("Z");
	        st.push(
	            paper.path(path.join(""))
	        );
	        st.attr({
	            fill: this.backgroundColor.hash()
	        });
	        return st;
	    }
	});
});