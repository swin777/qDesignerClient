define(["dojo/_base/declare", "ashDraw/layout/connection/ConnectionRouter"], function(declare){
	return declare("ashDraw.layout.connection.DirectRouter", ashDraw.layout.connection.ConnectionRouter, {
	    NAME : "ashDraw.layout.connection.DirectRouter",

	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(){
	    },
	    
	    invalidate:function(){
	    },
	    
	    route:function( connection){
	       var start =connection.getStartPoint();
	       var end = connection.getEndPoint();
	       
	       connection.addPoint(start);
	       connection.addPoint(end);
	       
	       var path = ["M",start.x," ",start.y];
	       path.push("L", end.x, " ", end.y);

	       connection.svgPathString = path.join("");
	    }
	});
});