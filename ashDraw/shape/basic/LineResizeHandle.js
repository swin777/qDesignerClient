define(["dojo/_base/declare", 
        "ashDraw/shape/basic/Circle",
        "ashDraw/util/Color",
        "ashDraw/command/CommandType",
        "ashDraw/Connection"], function(declare){
	return declare("ashDraw.shape.basic.LineResizeHandle", ashDraw.shape.basic.Circle, {
	    NAME: "ashDraw.shape.basic.LineResizeHandle",
	    
	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(type) {
	    	this.inherited(arguments);
	        if (ashDraw.isTouchDevice) {
	            this.setDimension(20, 20);
	        } else {
	            this.setDimension(10, 10);
	        }

	        this.setBackgroundColor(new ashDraw.util.Color(0, 255, 0));
	        this.currentTarget = null;

	        this.setSelectable(false);
	    },

	    getRelatedPort: function() {
	        return null;
	    },

	    getOppositePort: function() {
	        return null;
	    },

	    repaint: function(attributes) {
	        if (this.repaintBlocked === true || this.shape === null) {
	            return;
	        }

	        if (typeof attributes === "undefined") {
	            attributes = {};
	        }

	        // a port did have the 0/0 coordinate i the center and not in the top/left corner
	        //
	        attributes.fill = "r(.4,.3)#b4e391-#61c419:60-#299a0b";

	        this.inherited(arguments, [attributes]);
	    },

	    onDragStart: function() {
	        this.ox = this.x;
	        this.oy = this.y;

	        this.command = this.getCanvas().getCurrentSelection().createCommand(new ashDraw.command.CommandType(ashDraw.command.CommandType.MOVE_BASEPOINT));

	        return true;
	    },

	    onDrag: function(dx, dy) {
	        this.setPosition(this.ox + dx, this.oy + dy);

	        var port = this.getOppositePort();

	        target = port.getDropTarget(this.getX(), this.getY(), null);

	        // the hovering element has been changed
	        if (target !== this.currentTarget) {

	            if (this.currentTarget !== null) {
	                this.currentTarget.onDragLeave(port);
	                this.getCanvas().getCurrentSelection().setGlow(false);
	            }

	            if (target !== null) {
	                this.currentTarget = target.onDragEnter(port);
	                this.getCanvas().getCurrentSelection().setGlow(this.currentTarget !== null);
	            }
	        }

	        return true;
	    },

	    onDragEnd: function() {
	        if (!this.isDraggable()) {
	            return false;
	        }

	        var port = this.getOppositePort();
	        if (port !== null) {
	            if (this.currentTarget !== null) {

	                this.onDrop(this.currentTarget);
	                this.currentTarget.onDragLeave(port);
	                this.getCanvas().getCurrentSelection().setGlow(false);
	                this.currentTarget = null;
	            }
	        }

	        // A Connection is stuck to the corresponding ports. So we must reset the position
	        // to the origin port if we doesn't drop the ResizeHandle on a other port.
	        //
	        if (this.getCanvas().getCurrentSelection() instanceof ashDraw.Connection) {
	            if (this.command !== null) {
	                this.command.cancel();
	            }
	        }
	        //
	        else {
	            // An non draggable resizeHandle doesn't create a move/resize command.
	            // This happens if the selected figure has set "isResizeable=false".
	            //
	            if (this.command !== null) {
	                this.getCanvas().getCommandStack().execute(this.command);
	            }
	        }
	        this.command = null;
	        this.getCanvas().hideSnapToHelperLines();

	        return true;
	    },

	    supportsSnapToHelper: function() {
	        if (this.getCanvas().getCurrentSelection() instanceof ashDraw.Connection) {
	            return false;
	        }

	        return true;
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

	    onKeyDown: function(keyCode, ctrl) {
	        this.canvas.onKeyDown(keyCode, ctrl);
	    },


	    fireMoveEvent: function() {

	    }
	});
});