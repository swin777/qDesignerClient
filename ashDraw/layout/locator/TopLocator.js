define(["dojo/_base/declare", "ashDraw/layout/locator/Locator"], function(declare){
	return declare("ashDraw.layout.locator.TopLocator", ashDraw.layout.locator.Locator, {
	    NAME : "ashDraw.layout.locator.TopLocator",
	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(parent){
	    	this.inherited(arguments);
	    },
	    
	    relocate:function(index, target){
	       var parent = this.getParent();
	       var boundingBox = parent.getBoundingBox();
	    
	       var targetBoundingBox = target.getBoundingBox();
	       target.setPosition(boundingBox.w/2-(targetBoundingBox.w/2),-(targetBoundingBox.h+2));
	    }
	});
});