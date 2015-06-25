define(["dojo/_base/declare", "ashDraw/layout/locator/ConnectionLocator"], function(declare){
	return declare("ashDraw.layout.locator.ManhattanMidpointLocator", ashDraw.layout.locator.ConnectionLocator, {
	    NAME : "ashDraw.layout.locator.ManhattanMidpointLocator",
	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(){
	    	this.inherited(arguments);
	    },
	    
	    relocate:function(index, target){
	       var conn = this.getParent();
	       var points = conn.getPoints();
	       
	       var segmentIndex = Math.floor((points.getSize() -2) / 2);
	       if (points.getSize() <= segmentIndex+1)
	          return; 
	    
	       var p1 = points.get(segmentIndex);
	       var p2 = points.get(segmentIndex + 1);
	    
	       var x = parseInt((p2.x - p1.x) / 2 + p1.x +5);
	       var y = parseInt((p2.y - p1.y) / 2 + p1.y +5);
	    
	       target.setPosition(x,y);
	    }
	});
});