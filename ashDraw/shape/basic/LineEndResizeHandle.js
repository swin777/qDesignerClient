define(["dojo/_base/declare", "ashDraw/Connection", "ashDraw/shape/basic/LineResizeHandle"], function(declare){
	return declare("ashDraw.shape.basic.LineEndResizeHandle", ashDraw.shape.basic.LineResizeHandle, {
	    NAME: "ashDraw.shape.basic.LineEndResizeHandle",

	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(canvas) {
	    	this.inherited(arguments, [canvas]);
	    },

	    getRelatedPort: function() {
	        var line = this.getCanvas().getCurrentSelection();

	        if (line instanceof ashDraw.Connection) {
	            return line.getTarget();
	        }

	        return null;
	    },

	    getOppositePort: function() {
	        var line = this.getCanvas().getCurrentSelection();

	        if (line instanceof ashDraw.Connection) {
	            return line.getSource();
	        }

	        return null;
	    },

	    onDrag: function(dx, dy) {
	        var oldX = this.getX();
	        var oldY = this.getY();
	        this.inherited(arguments, [dx, dy]);
	        var diffX = oldX - this.getX();
	        var diffY = oldY - this.getY();

	        var line = this.getCanvas().getCurrentSelection();

	        var objPos = line.getEndPoint();

	        line.setEndPoint(objPos.x - diffX, objPos.y - diffY);
	        line.isMoving = true;
	        this.detachMoveListener(line);

	        return true;
	    },

	    onDrop: function(dropTarget) {
	        var line = this.getCanvas().getCurrentSelection();
	        line.isMoving = false;

	        if (line instanceof ashDraw.Connection && this.command !== null) {
	            this.command.setNewPorts(line.getSource(), dropTarget);
	            this.getCanvas().getCommandStack().execute(this.command);
	        }
	        this.command = null;
	    }
	});
});