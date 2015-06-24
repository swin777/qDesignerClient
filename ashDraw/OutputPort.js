dojo.declare("ashDraw.OutputPort", ashDraw.Port, {
    NAME: "ashDraw.OutputPort",

    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function(name) {
    	this.inherited(arguments, [name]);
        this.locator = new ashDraw.layout.locator.OutputPortLocator();
    },

    onDragEnter: function(figure) {
        if (figure instanceof ashDraw.InputPort) {
            return this.inherited(arguments, [figure]);
        }

        if (figure instanceof ashDraw.HybridPort) {
            return this.inherited(arguments, [figure]);
        }

        return null;
    },

    onDragLeave: function(figure) {
        if (figure instanceof ashDraw.InputPort) {
            this.inherited(arguments, [figure]);
        } else if (figure instanceof ashDraw.HybridPort) {
            this.inherited(arguments, [figure]);
        }
    },

    createCommand: function(request) {
        if (request.getPolicy() === ashDraw.command.CommandType.CONNECT) {
            if (request.source.getParent().getId() === request.target.getParent().getId()) {
                return null;
            }

            if (request.source instanceof ashDraw.InputPort) {
                return new ashDraw.command.CommandConnect(request.canvas, request.target, request.source);
            }
            if (request.source instanceof ashDraw.HybridPort) {
                return new ashDraw.command.CommandConnect(request.canvas, request.target, request.source);
            }

            return null;
        }
        return this.inherited(arguments, [request]);
    }
});