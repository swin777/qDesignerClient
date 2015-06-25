define(["dojo/_base/declare", "ashDraw/policy/DragDropEditPolicy", "ashDraw/geo/Point", "ashDraw/geo/Rectangle"], function(declare){
	return declare("ashDraw.policy.RegionEditPolicy", ashDraw.policy.DragDropEditPolicy, {
		"-chains-": {
	        constructor: "manual"
	    },
		
	    constructor: function( x,y,w,h){
	    	this.inherited(arguments);
	        if(x instanceof ashDraw.geo.Rectangle){
	            this.constRect = x;
	        }
	        else if(typeof h === "number"){
	            this.constRect = new ashDraw.geo.Rectangle(x,y,w,h);
	        }
	        else{
	            throw "Invalid parameter. RegionConstraintPolicy need a rectangle as parameter in the constructor";
	        }
	    },

	    apply : function(figure, x, y){
	        var r = null;
	        if (x instanceof ashDraw.geo.Point) {
	            r = new ashDraw.geo.Rectangle(x.x, x.y, figure.getWidth(), figure.getHeight());
	        }
	        else {
	            r = new ashDraw.geo.Rectangle(x, y, figure.getWidth(), figure.getHeight());
	        }
	        r = this.constRect.moveInside(r);
	        return r.getTopLeft();
	    }
	});
});