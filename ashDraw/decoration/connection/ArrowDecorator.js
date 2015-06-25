define(["dojo/_base/declare", "ashDraw/decoration/connection/Decorator"], function(declare){
	return declare("ashDraw.decoration.connection.ArrowDecorator", ashDraw.decoration.connection.Decorator, {
	    NAME: "ashDraw.decoration.connection.ArrowDecorator",

	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(width, height) {
	    	this.inherited(arguments, [width, height]);
	    },
	    
	    paint: function(paper) {
	        var st = paper.set();
	        var path = ["M0 0"];
	        path.push("L", this.width / 2.2, " ", -this.height / 3.6);
	        path.push("L", this.width / 2.2, " ", this.height / 3.6);
	        path.push("L0 0");
	        st.push(
	            paper.path(path.join(""))
	        );
	        //st.attr({fill:this.backgroundColor.hash()});
	        st.attr({
	            fill: this.color.hash()
	        });
	        st.attr({
	            stroke: this.color.hash()
	        });
	        return st;
	    }
	});
});