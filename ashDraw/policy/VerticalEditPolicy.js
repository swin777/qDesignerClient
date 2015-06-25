define(["dojo/_base/declare", "ashDraw/policy/DragDropEditPolicy", "ashDraw/geo/Point"], function(declare){
	return declare("ashDraw.policy.VerticalEditPolicy", ashDraw.policy.DragDropEditPolicy, {
		"-chains-": {
	        constructor: "manual"
	    },
		
	    constructor: function(){
	    	this.inherited(arguments);
	    },

	    apply : function(figure, x, y){
	        return new ashDraw.geo.Point(figure.getX(),y);
	    }
	});
});