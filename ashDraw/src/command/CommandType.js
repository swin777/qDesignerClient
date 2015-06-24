dojo.declare("ashDraw.command.CommandType", null, {
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
 
ashDraw.command.CommandType.DELETE         = "DELETE";
ashDraw.command.CommandType.MOVE           = "MOVE";
ashDraw.command.CommandType.CONNECT        = "CONNECT";
ashDraw.command.CommandType.MOVE_BASEPOINT = "MOVE_BASEPOINT";
ashDraw.command.CommandType.RESIZE         = "RESIZE";
ashDraw.command.CommandType.RELABEL         = "RELABEL";


