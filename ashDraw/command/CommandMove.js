define(["dojo/_base/declare", "ashDraw/command/Command"], function(declare){
	return declare("ashDraw.command.CommandMove", ashDraw.command.Command, {
	    NAME : "ashDraw.command.CommandMove", 

	    "-chains-": {
	        constructor: "manual"
	    },
	    constructor : function(figure, x, y){
	        this.inherited(arguments, ["Figure moved"]);
	        this.figure = figure;
	        if (typeof x === "undefined")
	        {
	            this.oldX = figure.getX();
	            this.oldY = figure.getY();
	        }
	        else
	        {
	            this.oldX = x;
	            this.oldY = y;
	        }
	   },

	    setStartPosition:function( x,  y){
	       this.oldX = x;
	       this.oldY = y;
	    },
	    

	    setPosition:function( x,  y){
	       this.newX = x;
	       this.newY = y;
	    },

	    canExecute:function(){
	      return this.newX!=this.oldX || this.newY!=this.oldY;
	    },
	    
	    execute:function(){
	       this.redo();
	    },
	    
	    undo:function(){
	       this.figure.setPosition(this.oldX, this.oldY);
	       this.groupAdminByMove();
	    },
	    
	    redo:function(){
	       this.figure.setPosition(this.newX, this.newY);
	       this.groupAdminByMove();
	    }
	});
});