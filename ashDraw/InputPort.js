define(["dojo/_base/declare", 
        "ashDraw/Port", 
        "ashDraw/layout/locator/InputPortLocator", 
        "ashDraw/command/CommandType", 
        "ashDraw/command/CommandConnect",
        "ashDraw/OutputPort",
        "ashDraw/HybridPort"], function(declare){
	return declare("ashDraw.InputPort", ashDraw.Port, {
	    NAME: "ashDraw.InputPort",

	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(name) {
	    	this.inherited(arguments, [name]);
	        this.locator = new ashDraw.layout.locator.InputPortLocator();
	    },

	    onDragEnter: function(figure) {
	        // User drag&drop a normal port
	        if (figure instanceof ashDraw.OutputPort) {
	            return this.inherited(arguments, [figure]);
	        }
	        // User drag&drop a normal port
	        if (figure instanceof ashDraw.HybridPort) {
	            return this.inherited(arguments, [figure]);
	        }

	        return null;
	    },

	    onDragLeave: function(figure) {
	        if (figure instanceof ashDraw.OutputPort) {
	            this.inherited(arguments, [figure]);
	        } else if (figure instanceof ashDraw.HybridPort) {
	            this.inherited(arguments, [figure]);
	        }
	    },
	    
	    createCommand: function(request) {
	        // Connect request between two ports
	        //
	        if (request.getPolicy() === ashDraw.command.CommandType.CONNECT) {
	            // loopback not supported at the moment
	            if (request.source.getParent().getId() === request.target.getParent().getId()) {
	                return null;
	            }

	            // InputPort can only connect to an OutputPort. InputPort->InputPort make no sense
	            if (request.source instanceof ashDraw.OutputPort) {
	                // This is the different to the OutputPort implementation of createCommand
	                return new ashDraw.command.CommandConnect(request.canvas, request.source, request.target);
	            }

	            if (request.source instanceof ashDraw.HybridPort) {
	                // This is the different to the OutputPort implementation of createCommand
	                return new ashDraw.command.CommandConnect(request.canvas, request.source, request.target);
	            }

	            return null;
	        }

	        return this.inherited(arguments, [request]);
	    }
	});
});