define(["dojo/_base/declare", "ashDraw/command/Command"], function(declare){
	return declare("ashDraw.command.CommandCollection", ashDraw.command.Command, {
	    NAME : "ashDraw.command.CommandCollection", 
	    
	    "-chains-": {
	        constructor: "manual"
	    },
	    constructor : function(){
	        this.inherited(arguments, ["Execute Commands"]);
	        this.commands = new ashDraw.util.ArrayList();
	     },
	    
	    add: function(command){
	    	this.command.add(command);
	    },
	    
	    execute:function(){
	    	for( var i=0; i< this.commands.getSize();i++){
	    		this.commands.get(i).execute();
	    	}
	    },
	    
	    redo:function(){
	    	for( var i=0; i< this.commands.getSize();i++){
	    		this.commands.get(i).redo();
	    	}
	    },
	    
	    undo:function(){
	    	for( var i=0; i< this.commands.getSize();i++){
	    		this.commands.get(i).undo();
	    	}
	    }
	});
});
