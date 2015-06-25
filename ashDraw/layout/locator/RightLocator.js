define(["dojo/_base/declare", "ashDraw/layout/locator/Locator"], function(declare){
	return declare("ashDraw.layout.locator.RightLocator", ashDraw.layout.locator.Locator, {
	    NAME : "ashDraw.layout.locator.RightLocator",
	    "-chains-": {
	        constructor: "manual"
	    },
	   
	    constructor: function(parent){
	    	this.inherited(arguments);
	    },
	    
	    relocate:function(index, target){
	       var parent = this.getParent();
	       var boundingBox = parent.getBoundingBox();
	       var topRight = boundingBox.getTopRight();
	       
	       var targetBoundingBox = target.getBoundingBox();
	       target.setPosition(boundingBox.w+5,(boundingBox.h/2)-(targetBoundingBox.h/2));
	    }
	});
});