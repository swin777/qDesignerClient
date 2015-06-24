define(["dojo/_base/declare", "ashDraw/command/Command"], function(declare){
	return declare("ashDraw.command.CommandConnect", ashDraw.command.Command, {
	    NAME : "ashDraw.command.CommandConnect", 
	    
	    "-chains-": {
	        constructor: "manual"
	    },
	    constructor: function(canvas, source, target){
	 	   this.inherited(arguments, ["Connecting Ports"]);
	        this.canvas = canvas;
	        this.source   = source;
	        this.target   = target;
	        this.connection = null;
	     },
	    
	    setConnection:function(connection){
	       this.connection=connection;
	    },
	    
	    execute:function(){
	       if(this.connection===null){
	          this.connection = ashDraw.Connection.createConnection(this.source, this.target);
	       }
	       this.connection.setSource(this.source);
	       this.connection.setTarget(this.target);
	       this.canvas.addFigure(this.connection);
	    },
	    
	    redo:function(){
	       this.canvas.addFigure(this.connection);
	       this.connection.reconnect();
	    },
	    
	    undo:function(){
	        this.canvas.removeFigure(this.connection);
	    }
	});
});