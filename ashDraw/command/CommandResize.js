define(["dojo/_base/declare", "ashDraw/command/Command"], function(declare){
	return declare("ashDraw.command.CommandResize", ashDraw.command.Command, {
	    NAME : "ashDraw.command.CommandResize", 

	    "-chains-": {
	        constructor: "manual"
	    },
	    constructor: function(figure, width, height) {
	    	this.inherited(arguments, ["Figure Figure"]);
	        this.figure = figure;
	        
	        if (typeof width === "undefined")
	        {
	            this.oldWidth = figure.getWidth();
	            this.oldHeight = figure.getHeight();
	        }
	        else
	        {
	            this.oldWidth = width;
	            this.oldHeight = height;
	        }
	    },
	  
	    setDimension:function( width, height){
	       this.newWidth  = parseInt(width);
	       this.newHeight = parseInt(height);
	    },

	    canExecute:function(){
	      return this.newWidth!=this.oldWidth || this.newHeight!=this.oldHeight;
	    },
	    
	    execute:function(){
	       this.redo();
	    },
	    
	    undo:function(){
	       this.figure.setDimension(this.oldWidth, this.oldHeight);
	       this.groupAdminByResize();
	    },
	    
	    redo:function(){
	       this.figure.setDimension(this.newWidth, this.newHeight);
	       this.groupAdminByResize();
	    }
	});
});