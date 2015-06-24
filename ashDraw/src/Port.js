dojo.declare("ashDraw.Port", ashDraw.shape.basic.Circle, {
    NAME: "ashDraw.Port",

    DEFAULT_BORDER_COLOR: new ashDraw.util.Color(44, 83, 158),

    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function(name) {
        this.locator = null;
        this.inherited(arguments);
        if (ashDraw.isTouchDevice) {
            this.setDimension(25, 25);
        } else {
            this.setDimension(10, 10);
        }

        this.ox = this.x;
        this.oy = this.y;
        this.originalSnapToGrid = false;
        this.originalSnapToGrid = false;
        this.coronaWidth = 5;
        this.corona = null; // Circle
        this.currentTarget = null; // Port

        this.setBackgroundColor(new ashDraw.util.Color(100, 180, 100));
        this.setStroke(1);
        this.setColor(this.DEFAULT_BORDER_COLOR);
        this.setSelectable(false);


        if (typeof name === "undefined") {
            this.name = null;
        } else {
            this.name = name;
        }

        this.connectionAnchor = new ashDraw.layout.anchor.ConnectionAnchor(this);

        this.value = null;
        this.maxFanOut = Number.MAX_VALUE;
    },

    setMaxFanOut: function(count) {
        this.maxFanOut = Math.max(1, count);
    },

    getMaxFanOut: function() {
        return this.maxFanOut;
    },

    setConnectionAnchor: function(anchor) {

        if (typeof anchor === "undefined" || anchor === null) {
            anchor = new ashDraw.layout.anchor.ConnectionAnchor();
        }

        this.connectionAnchor = anchor;
        this.connectionAnchor.setOwner(this);

        //        this.repaint();
    },

    getConnectionAnchorLocation: function(referencePoint) {
        return this.connectionAnchor.getLocation(referencePoint);
    },

    getConnectionAnchorReferencePoint: function() {
        return this.connectionAnchor.getReferencePoint();
    },

    setLocator: function(locator) {
        this.locator = locator;
    },

    setValue: function(value) {
        this.value = value;
        if (this.getParent() !== null) {
            this.getParent().onPortValueChanged(this);
        }
    },

    getValue: function() {
        return this.value;
    },

    repaint: function(attributes) {
        if (this.repaintBlocked === true || this.shape === null) {
            return;
        }

        if (typeof attributes === "undefined") {
            attributes = {};
        }

        attributes.cx = this.getAbsoluteX();
        attributes.cy = this.getAbsoluteY();
        attributes.rx = this.width / 4;
        attributes.ry = this.width / 4;
        attributes.fill = "r(.4,.3)#499bea-#207ce5:60-#207ce5";

        this.inherited(arguments, [attributes]);
    },

    onMouseEnter: function() {
        this.setStroke(2);
    },

    onMouseLeave: function() {
        this.setStroke(1);
    },

    getConnections: function() {
        var result = new ashDraw.util.ArrayList();
        var size = this.moveListener.getSize();
        for (var i = 0; i < size; i++) {
            var target = this.moveListener.get(i);
            if (target instanceof ashDraw.Connection) {
                result.add(target);
            }
        }
        return result;
    },

    setParent: function(parent) {
        this.inherited(arguments, [parent]);

        if (this.parent !== null) {
            this.parent.detachMoveListener(this);
        }

        if (this.parent !== null) {
            this.parent.attachMoveListener(this);
        }
    },

    getCoronaWidth: function() {
        return this.coronaWidth;
    },

    setCoronaWidth: function(width) {
        this.coronaWidth = width;
    },

    onDragStart: function() {
        this.originalSnapToGrid = this.parent.getCanvas().getSnapToGrid();
        this.originalSnapToGeometry = this.parent.getCanvas().getSnapToGeometry();
        this.parent.getCanvas().setSnapToGrid(false);
        this.parent.getCanvas().setSnapToGeometry(false);

        this.getShapeElement().toFront();
        // dont't call the super method. This creates a command and this is not necessary for a port
        this.ox = this.x;
        this.oy = this.y;

        return true;
    },

    onDrag: function(dx, dy) {
        this.isInDragDrop = true;

        this.inherited(arguments, [dx, dy]);

        this.parent.getCanvas().showConnectionLine(this.ox + this.getParent().getAbsoluteX(), this.oy + this.getParent().getAbsoluteY(),
            this.getAbsoluteX(), this.getAbsoluteY());

        var target = this.getDropTarget(this.getAbsoluteX(), this.getAbsoluteY(), this);
        // the hovering element has been changed
        if (target !== this.currentTarget) {
            if (this.currentTarget !== null) {
                this.currentTarget.onDragLeave(this);
            }
            if (target !== null) {
                this.currentTarget = target.onDragEnter(this);
            }
        }
    },

    onDragEnd: function() {
        this.parent.getCanvas().setSnapToGrid(this.originalSnapToGrid);
        this.parent.getCanvas().setSnapToGeometry(this.originalSnapToGeometry);
        this.setAlpha(1.0);
        this.setPosition(this.ox, this.oy);
        this.parent.getCanvas().hideConnectionLine();
        this.isInDragDrop = false;
        this.currentTarget = null;
    },

    onDragEnter: function(draggedFigure) {
        if (!(draggedFigure instanceof ashDraw.Port)) {
            return null;
        }
        if (this.getConnections().getSize() >= this.maxFanOut) {
            return null;
        }
        var request = new ashDraw.command.CommandType(ashDraw.command.CommandType.CONNECT);
        request.canvas = this.parent.getCanvas();
        request.source = draggedFigure;
        request.target = this;
        var command = this.createCommand(request);

        if (command === null) {
            return null;
        }

        this.parent.getCanvas().connectionLine.setGlow(true);
        this.setGlow(true);

        return this;
    },

    onDragLeave: function(figure) {
        if (!(figure instanceof ashDraw.Port)) {
            return;
        }

        this.parent.getCanvas().connectionLine.setGlow(false);
        this.setGlow(false);
    },

    onDrop: function(dropTarget) {
        if (!(dropTarget instanceof ashDraw.Port)) {
            return;
        }

        var request = new ashDraw.command.CommandType(ashDraw.command.CommandType.CONNECT);
        request.canvas = this.parent.getCanvas();
        request.source = dropTarget;
        request.target = this;
        var command = this.createCommand(request);

        if (command !== null) {
            this.parent.getCanvas().getCommandStack().execute(command);
        }
        this.setGlow(false);
    },

    onOtherFigureIsMoving: function(figure) {
        this.repaint();
        this.fireMoveEvent();
    },

    getName: function() {
        return this.name;
    },

    setName: function(name) {
        this.name = name;
    },

    hitTest: function( /*:int*/ iX, /*:int*/ iY) {
        var x = this.getAbsoluteX() - (this.coronaWidth * 2) - this.getWidth() / 2;
        var y = this.getAbsoluteY() - (this.coronaWidth * 2) - this.getHeight() / 2;
        var iX2 = x + this.width + (this.coronaWidth * 2);
        var iY2 = y + this.height + (this.coronaWidth * 2);
        return (iX >= x && iX <= iX2 && iY >= y && iY <= iY2);
    },

    setGlow: function(flag) {
        if (flag === true && this.corona === null) {
            this.corona = new ashDraw.Corona();
            this.corona.setDimension(this.getWidth() + (this.getCoronaWidth() * 2), this.getWidth() + (this.getCoronaWidth() * 2));
            this.corona.setPosition(this.getAbsoluteX() - this.getCoronaWidth() - this.getWidth() / 2, this.getAbsoluteY() - this.getCoronaWidth() - this.getHeight() / 2);
            this.corona.setCanvas(this.getCanvas());
            this.corona.getShapeElement();
            this.corona.repaint();
            // this.parent.getCanvas().addFigure(this.corona,this.getAbsoluteX()-this.getCoronaWidth()-this.getWidth()/2, this.getAbsoluteY()-this.getCoronaWidth()-this.getHeight()/2);
        } else if (flag === false && this.corona !== null) {
            this.corona.setCanvas(null);
            this.parent.getCanvas().removeFigure(this.corona);
            this.corona = null;
        }
    },

    createCommand: function(request) {
        if (request.getPolicy() === ashDraw.command.CommandType.MOVE) {
            if (!this.isDraggable()) {
                return null;
            }
            return new ashDraw.command.CommandMovePort(this);
        }

        if (request.getPolicy() === ashDraw.command.CommandType.CONNECT) {
            if (request.source.parent.id === request.target.parent.id) {
                return null;
            } else {
                return new ashDraw.command.CommandConnect(request.canvas, request.source, request.target);
            }
        }

        return null;
    },

    fireMoveEvent: function() {
        if (this.isInDragDrop === true) {
            return;
        }

        this.inherited(arguments);
    },

    getDropTarget: function(x, y, portToIgnore) {
        for (var i = 0; i < this.targets.getSize(); i++) {
            var target = this.targets.get(i);
            if (target !== portToIgnore) {
                if (target.hitTest(x, y) === true) {
                    return target;
                }
            }
        }

        return null;
    }
});


dojo.declare("ashDraw.Corona", ashDraw.shape.basic.Circle, {
    constructor: function() {
        this.setAlpha(0.3);
        this.setBackgroundColor(new ashDraw.util.Color(178, 225, 255));
        this.setColor(new ashDraw.util.Color(102, 182, 252));
    },

    setAlpha: function(percent) {
        this.inherited(arguments, [Math.min(0.3, percent)]);
        this.setDeleteable(false);
        this.setDraggable(false);
        this.setResizeable(false);
        this.setSelectable(false);
    }
});