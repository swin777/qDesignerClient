dojo.declare("ashDraw.policy.HorizontalEditPolicy", ashDraw.policy.DragDropEditPolicy, {
	"-chains-": {
        constructor: "manual"
    },
	
    constructor: function(){
    	this.inherited(arguments);
    },

    apply : function(figure, x, y){
        return new ashDraw.geo.Point(x,figure.getY());
    }
});