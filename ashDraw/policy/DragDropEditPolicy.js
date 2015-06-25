define(["dojo/_base/declare", "ashDraw/policy/EditPolicy"], function(declare){
	return declare("ashDraw.policy.DragDropEditPolicy", ashDraw.policy.EditPolicy, {
		"-chains-": {
	        constructor: "manual"
	    },
		
	    constructor: function(){
	    	this.inherited(arguments);
	    },
	    
	    getRole:function(){
	        return ashDraw.policy.EditPolicy.Role.PRIMARY_DRAG_ROLE;
	    },
	    
	    apply: function(figure, x,y){
	        // do nothing per default implementation
	        if(x instanceof ashDraw.geo.Point){
	            return x;
	        }
	        
	        return new ashDraw.geo.Point(x,y);
	    }
	});
});