define(["dojo/_base/declare"], function(declare){
	return declare("ashDraw.io.Reader", null, {
		"-chains-": {
	        constructor: "manual"
	    },
		
	    constructor: function(){
	    	this.inherited(arguments);
	    },
	    
	    unmarshal: function(canvas, document){
	    }
	});
});