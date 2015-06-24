define(["dojo/_base/declare"], function(declare){
	
	var CommandType = declare("ashDraw.command.CommandType", null, {
	    NAME : "ashDraw.command.CommandType",

	    "-chains-": {
	        constructor: "manual"
	    },
	    constructor: function(policy) {
	    	this.policy = policy;
	    },

	    getPolicy:function(){
	       return this.policy;
	    }
	});

	CommandType.DELETE         = "DELETE";
	CommandType.MOVE           = "MOVE";
	CommandType.CONNECT        = "CONNECT";
	CommandType.MOVE_BASEPOINT = "MOVE_BASEPOINT";
	CommandType.RESIZE         = "RESIZE";
	CommandType.RELABEL         = "RELABEL";
	
	return CommandType;
});