dojo.declare("ashDraw.command.CommandStackEvent", null, {
    NAME : "ashDraw.command.CommandStackEvent", 

    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function(stack, command, details) {
    	this.stack = stack;
        this.command = command;
        this.details = details;
    },
    
    getStack:function(){
       return this.stack;
    },
    
    getCommand:function(){
       return this.command;
    },
    
    getDetails:function(){
       return this.details;
    },
    
    isPostChangeEvent:function(){
       return 0 != (this.getDetails() & ashDraw.command.CommandStack.POST_MASK);
    },
    
    isPreChangeEvent:function(){
       return 0 != (this.getDetails() & ashDraw.command.CommandStack.PRE_MASK);
    }
});