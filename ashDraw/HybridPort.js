define(["dojo/_base/declare", 
        "ashDraw/Port", 
        "ashDraw/layout/locator/InputPortLocator", 
        "ashDraw/command/CommandType", 
        "ashDraw/InputPort",
        "ashDraw/command/CommandConnect",
        "ashDraw/OutputPort",
        "ashDraw/Connection",
        "ashDraw/decoration/connection/ArrowDecorator"], function(declare){
	return declare("ashDraw.HybridPort", ashDraw.Port, {
	    NAME: "ashDraw.HybridPort",
	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(name) {
	    	this.inherited(arguments, [name]);
	        this.locator = new ashDraw.layout.locator.InputPortLocator();
	    },

	    onDragEnter: function(figure) {
	        // Accept any kind of port
	        if (figure instanceof ashDraw.Port) {
	            return this.inherited(arguments, [figure]);
	        }

	        return null;
	    },

	    onDragLeave: function(figure) {
	        // Ports accepts only Ports as DropTarget
	        //
	        if (!(figure instanceof ashDraw.Port)) {
	            return;
	        }

	        // accept any kind of port
	        if (figure instanceof ashDraw.Port) {
	            this.inherited(arguments, [figure]);
	        }

	    },


	    createCommand: function(request) {
	        // Connect request between two ports
	        //
	        if (request.getPolicy() === ashDraw.command.CommandType.CONNECT) {
	            if (request.source.getParent() == null || request.source.getParent() == null) {
	                return null;
	            }
	            if (request.source.getParent().getId() === request.target.getParent().getId()) {
	                return null;
	            }

	            if (request.source instanceof ashDraw.InputPort) {
	                // This is the difference to the InputPort implementation of createCommand.
	                return new ashDraw.command.CommandConnect(request.canvas, request.target, request.source);
	            } else if (request.source instanceof ashDraw.OutputPort) {
	                // This is the different to the OutputPort implementation of createCommand
	                return new ashDraw.command.CommandConnect(request.canvas, request.source, request.target);
	            } else if (request.source instanceof ashDraw.HybridPort) {
	                // This is the different to the OutputPort implementation of createCommand
	                //return new ashDraw.command.CommandConnect(request.canvas, request.source, request.target);
	                var connCommand = new ashDraw.command.CommandConnect(request.canvas, request.target, request.source);
	                var conn = new ashDraw.Connection(this.canvas.connectType);
	                conn.setTargetDecorator(new ashDraw.decoration.connection.ArrowDecorator());
	                connCommand.setConnection(conn);
	                return connCommand;
	            }

	            return null;
	        }


	        return this.inherited(arguments, [request]);
	    }
	});
});