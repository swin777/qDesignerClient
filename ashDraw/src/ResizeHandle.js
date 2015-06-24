dojo.declare("ashDraw.ResizeHandle", ashDraw.shape.basic.Rectangle, {
    NAME: "ashDraw.ResizeHandle",

    DEFAULT_COLOR: "#99ccff",
    
    "-chains-": {
        constructor: "manual"
    },
    constructor: function(canvas, type){
    	this.inherited(arguments);
        this.type = type;
        this.canvas = canvas;
        this.command = null;
        this.commandMove = null;
        this.commandResize = null;

        this.setDimension();

        this.setBackgroundColor(this.DEFAULT_COLOR);
        this.setColor("#000000");
        this.setStroke(0.5);
        this.setSelectable(false);
        this.setRadius(0);
        this.targetFigure;
    },

//    constructor: function(canvas, type) {
//    	this.init(canvas, type);
//    },
//    
//    init: function(canvas, type) {
//    	this.inherited(arguments);
//        this.type = type;
//        this.canvas = canvas;
//        this.command = null;
//        this.commandMove = null;
//        this.commandResize = null;
//
//        this.setDimension();
//
//        this.setBackgroundColor(this.DEFAULT_COLOR);
//        this.setColor("#000000");
//        this.setStroke(0.5);
//        this.setSelectable(false);
//        this.setRadius(0);
//        this.targetFigure;
//    },

    getSnapToDirection: function() {
        switch (this.type) {
            case 1:
                return ashDraw.SnapToHelper.NORTH_WEST;
            case 2:
                return ashDraw.SnapToHelper.NORTH;
            case 3:
                return ashDraw.SnapToHelper.NORTH_EAST;
            case 4:
                return ashDraw.SnapToHelper.EAST;
            case 5:
                return ashDraw.SnapToHelper.SOUTH_EAST;
            case 6:
                return ashDraw.SnapToHelper.SOUTH;
            case 7:
                return ashDraw.SnapToHelper.SOUTH_WEST;
            case 8:
                return ashDraw.SnapToHelper.WEST;
            case 9:
                return ashDraw.SnapToHelper.NSEW;
            default:
                return ashDraw.SnapToHelper.EAST;
        }
    },

    onDragStart: function(figure) {
        if (!this.isDraggable()) {
            return false;
        }

        this.ox = this.getAbsoluteX();
        this.oy = this.getAbsoluteY();

        //var figure = this.getCanvas().getCurrentSelection();
        if (typeof figure == "undefined" || figure === null || !(figure instanceof ashDraw.Figure)) {
            figure = this.getCanvas().getCurrentSelection();
        }
        this.targetFigure = figure;

        this.commandMove = figure.createCommand(new ashDraw.command.CommandType(ashDraw.command.CommandType.MOVE));
        this.commandResize = figure.createCommand(new ashDraw.command.CommandType(ashDraw.command.CommandType.RESIZE));

        return true;
    },

    onDrag: function(dx, dy) {
        if (this.isDraggable() === false) {
            return;
        }

        var oldX = this.getAbsoluteX();
        var oldY = this.getAbsoluteY();

        // call the super.drag method with all snapTo### handler and adjustments
        this.inherited(arguments, [dx, dy]);

        var diffX = this.getAbsoluteX() - oldX;
        var diffY = this.getAbsoluteY() - oldY;

        //var obj = this.getCanvas().getCurrentSelection();
        var obj = this.targetFigure;
        var objPosX = obj.getAbsoluteX();
        var objPosY = obj.getAbsoluteY();
        var objWidth = obj.getWidth();
        var objHeight = obj.getHeight();

        switch (this.type) {
            case 1:
                obj.setDimension(objWidth - diffX, objHeight - diffY);
                obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY + (objHeight - obj.getHeight()));
                break;
            case 2:
                obj.setDimension(objWidth, objHeight - diffY);
                obj.setPosition(objPosX, objPosY + (objHeight - obj.getHeight()));
                break;
            case 3:
                obj.setDimension(objWidth + diffX, objHeight - diffY);
                obj.setPosition(objPosX, objPosY + (objHeight - obj.getHeight()));
                break;
            case 4:
                obj.setDimension(objWidth + diffX, objHeight);
                break;
            case 5:
                obj.setDimension(objWidth + diffX, objHeight + diffY);
                break;
            case 6:
                obj.setDimension(objWidth, objHeight + diffY);
                break;
            case 7:
                obj.setDimension(objWidth - diffX, objHeight + diffY);
                obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY);
                break;
            case 8:
                obj.setDimension(objWidth - diffX, objHeight);
                obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY);
                break;
        }
        this.canvas.moveResizeHandles(obj);
    },

    onDragEnd: function() {
        if (!this.isDraggable()) {
            return;
        }

        //var figure = this.canvas.getCurrentSelection();
        var figure = this.targetFigure;

        if (this.commandMove !== null) {
            this.commandMove.setPosition(figure.getX(), figure.getY());
            this.canvas.getCommandStack().execute(this.commandMove);
            this.commandMove = null;
        }

        if (this.commandResize !== null) {
            this.commandResize.setDimension(figure.getWidth(), figure.getHeight());
            this.canvas.getCommandStack().execute(this.commandResize);
            this.commandResize = null;
        }

        this.canvas.hideSnapToHelperLines();
    },

    setPosition: function(x, y) {
        this.x = x;
        this.y = y;

        this.repaint();
    },

    setDimension: function(width, height) {
        if (typeof height !== "undefined") {
            this.inherited(arguments, [width, height]);
        } else {
            if (ashDraw.isTouchDevice) {
                this.inherited(arguments, [15, 15]);
            } else {
                this.inherited(arguments, [8, 8]);
            }
        }

        var offset = this.getWidth();
        var offset2 = offset / 2;

        switch (this.type) {
            case 1:
                this.setSnapToGridAnchor(new ashDraw.geo.Point(offset, offset));
                break;
            case 2:
                this.setSnapToGridAnchor(new ashDraw.geo.Point(offset2, offset));
                break;
            case 3:
                this.setSnapToGridAnchor(new ashDraw.geo.Point(0, offset));
                break;
            case 4:
                this.setSnapToGridAnchor(new ashDraw.geo.Point(0, offset2));
                break;
            case 5:
                this.setSnapToGridAnchor(new ashDraw.geo.Point(0, 0));
                break;
            case 6:
                this.setSnapToGridAnchor(new ashDraw.geo.Point(offset2, 0));
                break;
            case 7:
                this.setSnapToGridAnchor(new ashDraw.geo.Point(offset, 0));
                break;
            case 8:
                this.setSnapToGridAnchor(new ashDraw.geo.Point(offset, offset2));
                break;
            case 9:
                this.setSnapToGridAnchor(new ashDraw.geo.Point(offset2, offset2));
                break;
        }

    },


    show: function(canvas, x, y) {
        if (this.shape === null) {
            this.setCanvas(canvas);
        }

        this.setPosition(x, y);
        this.shape.toFront();
    },

    hide: function() {
        if (this.shape === null) {
            return;
        }

        this.setCanvas(null);
    },

    supportsSnapToHelper: function() {
        return true;
    },

    onKeyDown: function(keyCode, ctrl) {
        this.canvas.onKeyDown(keyCode, ctrl);
    },


    fireMoveEvent: function() {}
});