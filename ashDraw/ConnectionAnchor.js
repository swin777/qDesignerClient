define(["dojo/_base/declare"], function(declare){
	return declare("ashDraw.ConnectionAnchor", null, {
	    NAME: "ashDraw.ConnectionAnchor",
	    
	    constructor: function(parm1) {
	        if (typeof parm1 === "undefined") {
	            throw "Missing parameter for 'owner' in ConnectionAnchor";
	        }
	        this.owner = parm1;
	    },
	    
	    getLocation: function(parm2) {
	        return this.getReferencePoint();
	    },
	    getOwner: function() {
	        
	    	return this.owner;
	    },
	    setOwner: function(parm3) {
	        if (typeof parm3 === "undefined") {
	            throw "Missing parameter for 'owner' in ConnectionAnchor.setOwner";
	        }
	        this.owner = parm3;
	    },
	    
	    getBox: function() {
	        return this.getOwner().getAbsoluteBounds();
	    },
	    
	    getReferencePoint: function() {
	        return this.getOwner().getAbsolutePosition();
	    }
	});
});