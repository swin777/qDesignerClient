define(["dojo/_base/declare"], function(declare){
	return declare("ashDraw.command.CommandStackEventListener", null, {
	    NAME : "ashDraw.command.CommandStackEventListener", 
	    
	    "-chains-": {
	        constructor: "manual"
	    },
	    constructor: function() {	
	    },
	    
	    stackChanged:function(event){
	    }
	});
});