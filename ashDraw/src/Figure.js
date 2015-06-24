dojo.declare("ashDraw.Figure", null, {
    NAME: "ashDraw.Figure",

    MIN_TIMER_INTERVAL: 50, // minimum timer interval in milliseconds

    constructor: function(width, height) {
        this.name = "ashDraw.Figure";
        this.id = ashDraw.util.UUID.create();

        // for undo/redo operation. It holds the command during a drag/drop operation
        // and execute it on the CommandStack if the user drop the figure.
        this.command = null;

        this.canvas = null;
        this.shape = null;

        // possible decorations ( e.g. a Label) of the Connection
        this.children = new ashDraw.util.ArrayList();

        // behavior flags
        //
        this.selectable = true;
        this.deleteable = true;
        this.resizeable = true;
        this.draggable = true;
        this.visible = true;

        this.canSnapToHelper = true;
        this.snapToGridAnchor = new ashDraw.geo.Point(0, 0); // hot spot for snap to grid  
        this.editPolicy = new ashDraw.util.ArrayList(); // List<ashDraw.layout.constraint.EditPolicy)

        // timer for animation or automatic update
        //
        this.timerId = -1;
        this.timerInterval = 0;

        // possible parent of the figure. 
        //
        this.parent = null;

        // appearance, position and dim properties
        //
        this.x = 0;
        this.y = 0;
        this.rotationAngle = 0;

        this.minHeight = 5;
        this.minWidth = 5;

        if (typeof height !== "undefined") {
            this.width = width;
            this.height = height;
        } else {
            this.width = this.getMinWidth();
            this.height = this.getMinHeight();
        }
        this.alpha = 1.0;

        // internal status flags for the Drag&Drop operation handling and other stuff
        //
        this.isInDragDrop = false;
        this.isMoving = false;
        this.originalAlpha = this.alpha;
        this.ox = 0;
        this.oy = 0;
        this.repaintBlocked = false;

        // listener for movement. required for Ports or property panes in the UI
        //
        this.moveListener = new ashDraw.util.ArrayList();

        this.label = "";
    },

    showResizeHandles: function(canvas, resizeHandle1, resizeHandle2, resizeHandle3, resizeHandle4, resizeHandle5, resizeHandle6, resizeHandle7, resizeHandle8, volatilePort) {

        resizeHandle1.show(canvas, 0, 0);
        resizeHandle3.show(canvas, 0, 0);
        resizeHandle5.show(canvas, 0, 0);
        resizeHandle7.show(canvas, 0, 0);

        resizeHandle1.setDraggable(this.isResizeable());
        resizeHandle3.setDraggable(this.isResizeable());
        resizeHandle5.setDraggable(this.isResizeable());
        resizeHandle7.setDraggable(this.isResizeable());

        if (this.isResizeable() === true) {
            resizeHandle1.setBackgroundColor(resizeHandle1.DEFAULT_COLOR);
            resizeHandle3.setBackgroundColor(resizeHandle3.DEFAULT_COLOR);
            resizeHandle5.setBackgroundColor(resizeHandle5.DEFAULT_COLOR);
            resizeHandle7.setBackgroundColor(resizeHandle7.DEFAULT_COLOR);
        } else {
            resizeHandle1.setBackgroundColor(null);
            resizeHandle3.setBackgroundColor(null);
            resizeHandle5.setBackgroundColor(null);
            resizeHandle7.setBackgroundColor(null);
        }

        if (this.isStrechable() && this.isResizeable()) {
            resizeHandle2.setDraggable(this.isResizeable());
            resizeHandle4.setDraggable(this.isResizeable());
            resizeHandle6.setDraggable(this.isResizeable());
            resizeHandle8.setDraggable(this.isResizeable());
            resizeHandle2.show(canvas, 0, 0);
            resizeHandle4.show(canvas, 0, 0);
            resizeHandle6.show(canvas, 0, 0);
            resizeHandle8.show(canvas, 0, 0);
            volatilePort.show(canvas, 0, 0, this)
        }

        this.moveResizeHandles(canvas, resizeHandle1, resizeHandle2, resizeHandle3, resizeHandle4, resizeHandle5, resizeHandle6, resizeHandle7, resizeHandle8, volatilePort);
    },

    moveResizeHandles: function(canvas, resizeHandle1, resizeHandle2, resizeHandle3, resizeHandle4, resizeHandle5, resizeHandle6, resizeHandle7, resizeHandle8, volatilePort) {
        var objHeight = this.getHeight();
        var objWidth = this.getWidth();
        var xPos = this.getX();
        var yPos = this.getY();
        if (typeof resizeHandle1 == "undefined" || typeof resizeHandle2 == "undefined" || typeof resizeHandle3 == "undefined" || typeof resizeHandle4 == "undefined" || typeof resizeHandle5 == "undefined" || typeof resizeHandle6 == "undefined" || typeof resizeHandle7 == "undefined" || typeof resizeHandle8 == "undefined" || typeof volatilePort == "undefined") {
            return;
        }

        if (this.isStrechable()) {
            resizeHandle1.setPosition(xPos - resizeHandle1.getWidth(), yPos - resizeHandle1.getHeight());
            resizeHandle3.setPosition(xPos + objWidth, yPos - resizeHandle3.getHeight());
            resizeHandle5.setPosition(xPos + objWidth, yPos + objHeight);
            resizeHandle7.setPosition(xPos - resizeHandle7.getWidth(), yPos + objHeight);
            resizeHandle2.setPosition(xPos + (objWidth / 2) - (resizeHandle2.getWidth() / 2), yPos - resizeHandle2.getHeight());
            resizeHandle4.setPosition(xPos + objWidth, yPos + (objHeight / 2) - (resizeHandle4.getHeight() / 2));
            resizeHandle6.setPosition(xPos + (objWidth / 2) - (resizeHandle6.getWidth() / 2), yPos + objHeight);
            resizeHandle8.setPosition(xPos - resizeHandle8.getWidth(), yPos + (objHeight / 2) - (resizeHandle8.getHeight() / 2));
            volatilePort.setPosition(xPos + (objWidth / 2), yPos + (objHeight / 2))
        }
    },

    getId: function() {
        return this.id;
    },

    setId: function(id) {
        this.id = id;
    },

    setCanvas: function(canvas) {
        // remove the shape if we reset the canvas and the element
        // was already drawn
        if (canvas === null && this.shape !== null) {
            this.shape.remove();
            this.shape = null;
        }

        this.canvas = canvas;

        if (this.canvas !== null) {
            this.getShapeElement();
        }

        if (canvas === null) {
            this.stopTimer();
        } else {
            if (this.timerInterval >= this.MIN_TIMER_INTERVAL) {
                this.startTimer(this.timerInterval);
            }
        }

        for (var i = 0; i < this.children.getSize(); i++) {
            var entry = this.children.get(i);
            entry.figure.setCanvas(canvas);
        }

        if (this.shape !== null) {
            _canvas = this.canvas;
            this.shape.mouseover(this.mouseoverHandler);
            this.shape.mouseout(this.mouseoutHandler);
            this.shape.mousedown(this.mousedownHandler)
            this.shape.parentFigure = this;
        }
    },

    _canvas: null,

    getCanvas: function() {
        return this.canvas;
    },


    startTimer: function(milliSeconds, callback) {
        this.stopTimer();
        this.timerInterval = Math.max(this.MIN_TIMER_INTERVAL, milliSeconds);

        if (this.canvas !== null) {
            if (callback) {
                this.timerId = window.setInterval($.proxy(callback, this), this.timerInterval);
            } else {
                this.timerId = window.setInterval($.proxy(this.onTimer, this), this.timerInterval);
            }
        }
    },


    stopTimer: function() {
        if (this.timerId >= 0) {
            window.clearInterval(this.timerId);
            this.timerId = -1;
        }
    },


    onTimer: function() {

    },

    installEditPolicy: function(policy) {
        this.editPolicy.add(policy);
    },


    addFigure: function(child, locator) {
        // the child is now a slave of the parent
        //
        child.setDraggable(false);
        child.setSelectable(false);
        child.setParent(this);

        var entry = {};
        entry.figure = child;
        entry.locator = locator;

        this.children.add(entry);

        if (this.canvas !== null) {
            child.setCanvas(this.canvas);
        }

        this.repaint();
    },


    getChildren: function() {
        var shapes = new ashDraw.util.ArrayList();
        this.children.each(function(i, e) {
            shapes.add(e.figure);
        });
        return shapes;
    },



    resetChildren: function() {
        this.children.each(function(i, e) {
            e.figure.setCanvas(null);
        });
        this.children = new ashDraw.util.ArrayList();
        this.repaint();
    },



    getShapeElement: function() {
        if (this.shape !== null) {
            return this.shape;
        }

        this.shape = this.createShapeElement();
        return this.shape;
    },



    createShapeElement: function() {
        throw "Inherited class [" + this.NAME + "] must override the abstract method createShapeElement";
    },



    repaint: function(attributes) {
        if (this.repaintBlocked === true || this.shape === null) {
            return;
        }

        if (typeof attributes === "undefined") {
            attributes = {};
        }

        if (this.visible === true) {
            this.shape.show();
        } else {
            this.shape.hide();
            return;
        }

        // enrich with common properties
        attributes.opacity = this.alpha;

        if (this.rotationAngle !== 0) {
            this.shape.transform("r" + this.rotationAngle + "," + this.getAbsoluteX() + "," + this.getAbsoluteY());
        } else {
            this.shape.transform("");
        }

        this.shape.attr(attributes);

        // Relocate all children of the figure.
        // This means that the Locater can calculate the new Position of the child.
        //
        for (var i = 0; i < this.children.getSize(); i++) {
            var entry = this.children.get(i);
            entry.locator.relocate(i, entry.figure);
        }
    },


    setGlow: function(flag) {
        // do nothing in the base class. 
        // Subclasses must implement this method.
    },



    onDragStart: function(relativeX, relativeY) {
        this.isInDragDrop = false;
        this.isMoving = false;
        this.originalAlpha = this.getAlpha();

        this.command = this.createCommand(new ashDraw.command.CommandType(ashDraw.command.CommandType.MOVE));

        if (this.command !== null) {
            this.ox = this.x;
            this.oy = this.y;
            this.isInDragDrop = true;
            return true;
        }

        return false;
    },


    onDrag: function(dx, dy) {
        // apply all EditPolicy for DragDrop Operations
        //
        this.editPolicy.each($.proxy(function(i, e) {
            if (e.getRole() === ashDraw.policy.EditPolicy.Role.PRIMARY_DRAG_ROLE) {
                var newPos = e.apply(this, this.ox + dx, this.oy + dy);
                dx = newPos.x - this.ox;
                dy = newPos.y - this.oy;
            }
        }, this));

        this.x = this.ox + dx;
        this.y = this.oy + dy;

        // Adjust the new location if the object can snap to a helper
        // like grid, geometry, ruler,...
        //
        if (this.getCanSnapToHelper()) {
            var p = new ashDraw.geo.Point(this.x, this.y);
            p = this.getCanvas().snapToHelper(this, p);
            this.x = p.x;
            this.y = p.y;
        }


        this.setPosition(this.x, this.y);


        // enable the alpha blending of the first real move of the object
        //
        if (this.isMoving === false) {
            this.isMoving = true;
            this.setAlpha(this.originalAlpha * 0.7);
        }
    },


    onPanning: function(dx, dy) {

    },



    onDragEnd: function() {
        this.setAlpha(this.originalAlpha);

        // Element ist zwar schon an seine Position, das Command muss aber trotzdem
        // in dem CommandStack gelegt werden damit das Undo funktioniert.
        //
        if (this.canvas.getSnapToGrid()) {
            var tmpX = this.x / 10;
            var tmpY = this.y / 10;
            this.x = Math.round(tmpX) * 10;
            this.y = Math.round(tmpY) * 10;
        }
        this.command.setPosition(this.x, this.y);
        this.isInDragDrop = false;

        this.canvas.commandStack.execute(this.command);
        this.command = null;
        this.isMoving = false;
        this.fireMoveEvent();
    },


    onDragEnter: function(draggedFigure) {
        return null;
    },


    onDragLeave: function(draggedFigure) {},



    onDrop: function(dropTarget) {},



    onMouseEnter: function() {},



    onMouseLeave: function() {},


    onDoubleClick: function() {},



    onClick: function() {},


    onContextMenu: function(x, y) {

    },


    setAlpha: function(percent) {
        if (percent === this.alpha) {
            return;
        }

        this.alpha = percent;
        this.repaint();
    },



    getAlpha: function() {
        return this.alpha;
    },



    setRotationAngle: function(angle) {
        this.rotationAngle = angle;

        this.repaint();
    },



    setVisible: function(flag) {
        this.visible = flag;

        this.repaint();
    },


    isVisible: function() {
        return this.visible && this.shape !== null;
    },


    getZOrder: function() {
        if (this.shape === null) {
            return -1;
        }

        var i = 0;
        var child = this.shape.node;
        while ((child = child.previousSibling) !== null) {
            i++;
        }
        return i;
    },


    setCanSnapToHelper: function( /*:boolean */ flag) {
        this.canSnapToHelper = flag;
    },


    getCanSnapToHelper: function() {
        return this.canSnapToHelper;
    },


    getSnapToGridAnchor: function() {
        return this.snapToGridAnchor;
    },


    setSnapToGridAnchor: function(point) {
        this.snapToGridAnchor = point;
    },


    getWidth: function() {
        return this.width;
    },


    getHeight: function() {
        return this.height;
    },



    getMinWidth: function() {
        return this.minWidth;
    },


    setMinWidth: function(w) {
        this.minWidth = w;
    },


    getMinHeight: function() {
        return this.minHeight;
    },


    setMinHeight: function(h) {
        this.minHeight = h;
    },


    getX: function() {
        return this.x;
    },


    getY: function() {
        return this.y;
    },



    getAbsoluteX: function() {
        if (this.parent === null) {
            return this.x;
        }
        return this.x + this.parent.getAbsoluteX();
    },



    getAbsoluteY: function() {
        if (this.parent === null) {
            return this.y;
        }
        return this.y + this.parent.getAbsoluteY();
    },



    getAbsolutePosition: function() {
        return new ashDraw.geo.Point(this.getAbsoluteX(), this.getAbsoluteY());
    },


    getAbsoluteBounds: function() {
        return new ashDraw.geo.Rectangle(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight());
    },



    setPosition: function(x, y) {
        this.x = x;
        this.y = y;

        this.repaint();

        // Update the resize handles if the user change the position of the element via an API call.
        //
        if (this.canvas && this.canvas !== null) {
            this.canvas.moveResizeHandles(this);
        }
        this.fireMoveEvent();
    },


    translate: function(dx, dy) {
        this.setPosition(this.x + dx, this.y + dy);
    },



    setDimension: function(w, h) {
        this.width = Math.max(this.getMinWidth(), w);
        this.height = Math.max(this.getMinHeight(), h);

        this.repaint();

        this.fireMoveEvent();

        // Update the resize handles if the user change the dimension via an API call
        //
        if (this.canvas && this.canvas !== null) {
            this.canvas.moveResizeHandles(this);
        }
    },



    getBoundingBox: function() {
        return new ashDraw.geo.Rectangle(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight());
    },


    hitTest: function(iX, iY) {
        var x = this.getAbsoluteX();
        var y = this.getAbsoluteY();
        var iX2 = x + this.getWidth();
        var iY2 = y + this.getHeight();
        return (iX >= x && iX <= iX2 && iY >= y && iY <= iY2);
    },



    setDraggable: function(flag) {
        this.draggable = flag;
    },


    isDraggable: function() {
        return this.draggable;
    },



    isResizeable: function() {
        return this.resizeable;
    },


    setResizeable: function(flag) {
        this.resizeable = flag;
    },


    isSelectable: function() {
        return this.selectable;
    },



    setSelectable: function(flag) {
        this.selectable = flag;
    },


    isStrechable: function() {
        return true;
    },


    isDeleteable: function() {
        return this.deleteable;
    },


    setDeleteable: function(flag) {
        this.deleteable = flag;
    },


    setParent: function(parent) {
        this.parent = parent;
    },


    getParent: function() {
        return this.parent;
    },


    attachMoveListener: function(listener) {
        if (listener === null) {
            return;
        }

        this.moveListener.add(listener);
    },



    detachMoveListener: function(figure) {
        if (figure === null || this.moveListener === null) {
            return;
        }

        this.moveListener.remove(figure);
    },


    fireMoveEvent: function() {
        // first call. Reured for connections to update the routing,...
        //
        this.moveListener.each($.proxy(function(i, item) {
            item.onOtherFigureIsMoving(this);
        }, this));

    },


    onOtherFigureIsMoving: function(figure) {},


    createCommand: function(request) {
        if (request === null) {
            return null;
        }

        if (request.getPolicy() === ashDraw.command.CommandType.MOVE) {
            if (!this.isDraggable()) {
                return null;
            }
            return new ashDraw.command.CommandMove(this);
        }

        if (request.getPolicy() === ashDraw.command.CommandType.DELETE) {
            if (!this.isDeleteable()) {
                return null;
            }
            return new ashDraw.command.CommandDelete(this);
        }

        if (request.getPolicy() === ashDraw.command.CommandType.RESIZE) {
            if (!this.isResizeable()) {
                return null;
            }
            return new ashDraw.command.CommandResize(this);
        }

        return null;
    },



    getPersistentAttributes: function() {
        var memento = {
            type: this.NAME,
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            label: this.label
        };
        return memento;
    },


    setPersistentAttributes: function(memento) {
        this.id = memento.id;
        this.x = memento.x;
        this.y = memento.y;

        // width and height are optional parameter for the JSON stuff.
        // We use the defaults if the attributes not present
        if (typeof memento.width !== "undefined") {
            this.width = memento.width;
        }

        if (typeof memento.height !== "undefined") {
            this.height = memento.height;
        }

        if (typeof memento.label !== "undefined") {
            this.setLabel(memento.label);
        } else {
            this.setLabel("");
        }
    },

    mousedownHandler: function(event) {
        try {
            _canvas.onMouseDown(event.layerX, event.layerY, this.parentFigure);
        } catch (e) {}
    },

    mouseoverHandler: function(event) {
        try {
            _canvas.onMouseOver(event.layerX, event.layerY, this.parentFigure);
        } catch (e) {}
    },

    mouseoutHandler: function(event) {
        try {
            _canvas.onMouseOut(event.layerX, event.layerY, this.parentFigure);
        } catch (e) {}
    },

    setArr: function(el, attr) {
        if (attr) {
            for (var key in attr)
                if (attr.hasOwnProperty(key)) {
                    el.setAttribute(key, attr[key]);
                }
        } else {
            return document.createElementNS("http://www.w3.org/2000/svg", el);
        }
    },

    onBlackAndWhite: function() {
        var filterAtt = this.shape.node.getAttribute("filter");
        this.setArr(this.shape.node, {
            filter: "url(#blackAndWhite)"
        });
    },

    offBlackAndWhite: function() {
        this.setArr(this.shape.node, {
            filter: ""
        });
    },

    onBlackAndWhiteToogle: function() {
        var filterAtt = this.shape.node.getAttribute("filter");
        if (filterAtt == null || typeof filterAtt == "undefined" || filterAtt == "") {
            this.setArr(this.shape.node, {
                filter: "url(#blackAndWhite)"
            });
        } else {
            this.setArr(this.shape.node, {
                filter: ""
            });
        }
    },

    onGlow: function() {
        this.glowObj = this.shape.glow({
            color: "#00ff00",
            width: 25,
            fill: true,
            opacity: 0.8
        });
    },

    onGlowToogle: function() {
        if (!this.glowObj) {
            this.glowObj = this.shape.glow({
                color: "#00ff00",
                width: 25,
                fill: true,
                opacity: 0.8
            });
        } else {
            this.glowObj.remove();
            this.glowObj = null;
        }
    },

    offGlow: function() {
        if (this.glowObj) {
            this.glowObj.remove();
            this.glowObj = null;
        }
    },

    onGlowToogleStart: function() {
        this.startTimer(500, this.onGlowToogle);
    },

    onGlowToogleStop: function() {
        this.stopTimer();
        if (this.glowObj) {
            this.glowObj.remove();
            this.glowObj = null;
        }
    },

    setLabel: function(labelStr) {
        this.label = labelStr;
        var children = this.getChildren();
        if (children.getSize() > 0) {
            if (children.get(0) instanceof ashDraw.shape.basic.Label) {
                children.get(0).setText(labelStr);
            }
        } else {
            var label = new ashDraw.shape.basic.Label(labelStr);
            label.setFontColor("#0000ff");
            label.setStroke(0);
            if (this.canvas != null) {
                label.setVisible(this.canvas.labelView);
            }
            this.addFigure(label, new ashDraw.layout.locator.BottomLocator(this));
        }
        this.relocate();
    },

    getLabel: function() {
        return this.label;
    },

    relocate: function() {
        for (var i = 0; i < this.children.getSize(); i++) {
            var entry = this.children.get(i);
            entry.locator.relocate(i, entry.figure);
        }
    }
});