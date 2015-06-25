define(["dojo/_base/declare", "ashDraw/layout/anchor/ConnectionAnchor"], function(declare){
	return declare("ashDraw.layout.anchor.ChopboxConnectionAnchor", ashDraw.layout.anchor.ConnectionAnchor, {
	    NAME: "ashDraw.layout.anchor.ChopboxConnectionAnchor",
	    
	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(owner){
	    	this.inherited(arguments);
	    },

	    getLocation: function(reference) {
	        var r = new ashDraw.geo.Rectangle(0, 0);
	        r.setBounds(this.getBox());
	        r.translate(-1, -1);
	        r.resize(1, 1);

	        var centerX = r.x + r.w / 2;
	        var centerY = r.y + r.h / 2;

	        if (r.isEmpty() || (reference.x == centerX && reference.y == centerY))
	            return new ashDraw.geo.Point(centerX, centerY); // This avoids divide-by-zero

	        var dx = reference.x - centerX;
	        var dy = reference.y - centerY;

	        // r.width, r.height, dx, and dy are guaranteed to be non-zero.
	        var scale = 0.5 / Math.max(Math.abs(dx) / r.w, Math.abs(dy) / r.h);

	        dx *= scale;
	        dy *= scale;
	        centerX += dx;
	        centerY += dy;

	        return new ashDraw.geo.Point(Math.round(centerX), Math.round(centerY));
	    },

	    getBox: function() {
	        return this.getOwner().getParent().getBoundingBox();
	    },

	    getReferencePoint: function() {
	        return this.getBox().getCenter();
	    }
	});
});