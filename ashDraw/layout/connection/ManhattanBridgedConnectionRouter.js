define(["dojo/_base/declare", "ashDraw/layout/connection/ManhattanConnectionRouter"], function(declare){
	return declare("ashDraw.layout.connection.ManhattanBridgedConnectionRouter", ashDraw.layout.connection.ManhattanConnectionRouter, {
	    NAME : "ashDraw.layout.connection.ManhattanBridgedConnectionRouter",

		BRIDE_HORIZONTAL_LR : " r 0 0 3 -4 7 -4 10 0 13 0 ", // Left to right
	    BRIDE_HORIZONTAL_RL : " r 0 0 -3 -4 -7 -4 -10 0 -13 0 ", // right to left
	 
	    
	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(){
	    },
	   
		route : function(conn) {
			var fromPt  = conn.getStartPoint();
			var fromDir = this.getStartDirection(conn);

			var toPt  = conn.getEndPoint();
			var toDir = this.getEndDirection(conn);

			// calculate the lines between the two points.
			//
			this._route(conn, toPt, toDir, fromPt, fromDir);

			// calculate the path string for the SVG rendering
			//
	        var intersectionsASC = conn.getCanvas().getIntersection(conn).sort("x");
	        var intersectionsDESC= intersectionsASC.clone().reverse();
	        
	        var intersectionForCalc = intersectionsASC;
			var i = 0;

			var ps = conn.getPoints();
			var p = ps.get(0);
			var path = [ "M", parseInt(p.x), " ", parseInt(p.y) ];
			var oldP = p;
			for (i = 1; i < ps.getSize(); i++) {
				p = ps.get(i);
	       
				// check for intersection and paint a bridge if required
				// line goes from left to right
				//
				var bridgeWidth = 5;
				var bridgeCode = this.BRIDE_HORIZONTAL_LR;

				// line goes from right->left. Inverse the bridge and the bridgeWidth
				//
				if (oldP.x > p.x) {
					intersectionForCalc=intersectionsDESC;
					bridgeCode = this.BRIDE_HORIZONTAL_RL;
					bridgeWidth = -bridgeWidth;
				}

				intersectionForCalc.each(function(ii, interP) {
					if (ashDraw.shape.basic.Line.hit(1, oldP.x, oldP.y, p.x, p.y, interP.x, interP.y) === true) {
						// we draw only horizontal bridges. Just a design decision
						//
						if (p.y === interP.y) {
							path.push(" L", parseInt((interP.x - bridgeWidth)), " ", parseInt(interP.y));
							path.push(bridgeCode);
						}
					}

				});

				path.push(" L", parseInt(p.x), " ", parseInt(p.y));
				oldP = p;
			}
			conn.svgPathString = path.join("");
		}
	});
});