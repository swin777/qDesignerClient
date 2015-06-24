dojo.declare("ashDraw.shape.node.Node", ashDraw.Figure, {
    NAME: "ashDraw.shape.node.Node",
    
    "-chains-": {
        constructor: "manual"
    },
    constructor: function(width, height){
    	this.bgColor = new ashDraw.util.Color(255, 255, 255);
        this.lineColor = new ashDraw.util.Color(128, 128, 255);
        this.lineStroke = 1;
        this.inputPorts = new ashDraw.util.ArrayList();
        this.outputPorts = new ashDraw.util.ArrayList();
        this.hybridPorts = new ashDraw.util.ArrayList();
        this.inherited(arguments, [width, height]);
    },

//    constructor: function(width, height) {
//    	this.init(width, height);
//    },
//    
//    init: function(width, height) {
//        this.bgColor = new ashDraw.util.Color(255, 255, 255);
//        this.lineColor = new ashDraw.util.Color(128, 128, 255);
//        this.lineStroke = 1;
//        this.inputPorts = new ashDraw.util.ArrayList();
//        this.outputPorts = new ashDraw.util.ArrayList();
//        this.hybridPorts = new ashDraw.util.ArrayList();
//        this.inherited(arguments);
//    },

    getPorts: function() {
        // TODO: expensive! Find another solution.
        return this.inputPorts
            .clone()
            .addAll(this.outputPorts)
            .addAll(this.hybridPorts);
    },

    getInputPorts: function() {
        return this.inputPorts
            .clone()
            .addAll(this.hybridPorts);
    },

    getOutputPorts: function() {
        return this.outputPorts
            .clone()
            .addAll(this.hybridPorts);
    },

    getPort: function(portName) {
        var i = 0;
        for (i = 0; i < this.outputPorts.getSize(); i++) {
            var port = this.outputPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }

        for (i = 0; i < this.inputPorts.getSize(); i++) {
            var port = this.inputPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }

        for (i = 0; i < this.hybridPorts.getSize(); i++) {
            var port = this.hybridPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }
        return null;
    },

    getInputPort: function(portName) {
        if (typeof portName === "number") {
            return this.inputPorts.get(portName);
        }

        for (var i = 0; i < this.inputPorts.getSize(); i++) {
            var port = this.inputPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }

        return null;
    },

    getOutputPort: function(portName) {
        if (typeof portName === "number") {
            return this.outputPorts.get(portName);
        }

        for (var i = 0; i < this.outputPorts.getSize(); i++) {
            var port = this.outputPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }

        return null;
    },

    getHybridPort: function(portName) {
        if (typeof portName === "number") {
            return this.hybridPorts.get(portName);
        }

        for (var i = 0; i < this.hybridPorts.getSize(); i++) {
            var port = this.hybridPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }

        return null;
    },

    addPort: function(port, locator) {
        if (!(port instanceof ashDraw.Port)) {
            throw "Argument is not typeof 'ashDraw.Port'. \nFunction: ashDraw.shape.node.Node#addPort";
        }


        if (port instanceof ashDraw.InputPort) {
            this.inputPorts.add(port);
        } else if (port instanceof ashDraw.OutputPort) {
            this.outputPorts.add(port);
        } else if (port instanceof ashDraw.HybridPort) {
            this.hybridPorts.add(port);
        }

        if ((typeof locator !== "undefined") && (locator instanceof ashDraw.layout.locator.Locator)) {
            port.setLocator(locator);
        }

        port.setParent(this);
        port.setCanvas(this.canvas);

        // You can't delete a port with the [DEL] key if a port is a child of a node
        port.setDeleteable(false);

        if (this.canvas !== null) {
            port.getShapeElement();
            this.canvas.registerPort(port);
        }
    },

    removePort: function(port) {
        this.inputPorts.remove(port);
        this.outputPorts.remove(port);
        this.hybridPorts.remove(port);

        if (port.getCanvas() !== null) {
            port.getCanvas().unregisterPort(port);
            // remove the related connections of the port too.
            var connections = port.getConnections();
            for (var i = 0; i < connections.getSize(); ++i) {
                port.getCanvas().removeFigure(connections.get(i));
            }
        }

        port.setCanvas(null);
    },

    createPort: function(type, locator) {
        var newPort = null;
        var count = 0;

        switch (type) {
            case "input":
                newPort = new ashDraw.InputPort();
                count = this.inputPorts.getSize();
                break;
            case "output":
                newPort = new ashDraw.OutputPort();
                count = this.outputPorts.getSize();
                break;
            case "hybrid":
                newPort = new ashDraw.HybridPort();
                count = this.hybridPorts.getSize();
                break;
            default:
                throw "Unknown type [" + type + "] of port requested";
        }

        newPort.setName(type + count);

        this.addPort(newPort, locator);
        // relayout the ports

        newPort.setVisible(false);
        newPort.width = 18;
        newPort.height = 18;
        return newPort;
    },

    getConnections: function() {
        var connections = new ashDraw.util.ArrayList();
        var ports = this.getPorts();
        for (var i = 0; i < ports.getSize(); i++) {
            var port = ports.get(i);
            // Do NOT add twice the same connection if it is linking ports from the same node
            for (var c = 0, c_size = port.getConnections().getSize(); c < c_size; c++) {
                if (!connections.contains(port.getConnections().get(c))) {
                    connections.add(port.getConnections().get(c));
                }
            }
        }
        return connections;
    },

    setCanvas: function(canvas) {
        var oldCanvas = this.canvas;
        this.inherited(arguments, [canvas]);

        var ports = this.getPorts();
        if (oldCanvas !== null) {
            ports.each(function(i, port) {
                oldCanvas.unregisterPort(port);
            });
        }

        if (canvas !== null) {
            ports.each(function(i, port) {
                port.setCanvas(canvas);
                canvas.registerPort(port);
            });
            // relayout the ports
            this.setDimension(this.width, this.height);
        } else {
            ports.each(function(i, port) {
                port.setCanvas(null);
            });
        }
    },

    setDimension: function(w, h) {
        this.inherited(arguments, [w, h]);

        // make no sense to layout the ports if we not part
        // of the canvas
        if (this.shape === null) {
            return;
        }

        // layout the ports
        //
        this.outputPorts.each(function(i, port) {
            port.locator.relocate(i, port);
        });

        this.inputPorts.each(function(i, port) {
            port.locator.relocate(i, port);
        });

        this.hybridPorts.each(function(i, port) {
            port.locator.relocate(i, port);
        });
    },

    onPortValueChanged: function(relatedPort) {

    }
});