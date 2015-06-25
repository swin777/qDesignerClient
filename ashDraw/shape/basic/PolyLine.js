define(["dojo/_base/declare", 
        "ashDraw/shape/basic/Line", 
        "ashDraw/util/ArrayList", 
        "ashDraw/util/Color", 
        "ashDraw/geo/Point", 
        "ashDraw/command/CommandType", 
        "ashDraw/command/CommandDelete"], function(declare){
	return declare("ashDraw.shape.basic.PolyLine", ashDraw.shape.basic.Line, {
	    NAME: "ashDraw.shape.basic.PolyLine",

	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function() {
	        this.svgPathString = null;
	        this.oldPoint = null;
	        this.lineSegments = new ashDraw.util.ArrayList();
	        this.basePoints = new ashDraw.util.ArrayList();
	        this.bridges = new ashDraw.util.ArrayList();
	        this.inherited(arguments);
	        this.setColor(new ashDraw.util.Color(0, 0, 115));
	        this.setStroke(1);
	    },

	    setStartPoint: function(x, y) {
	        this.repaintBlocked = true;
	        this.inherited(arguments, [x, y]);
	        this.calculatePath();

	        this.repaintBlocked = false;
	        this.repaint();
	    },

	    setEndPoint: function(x, y) {
	        this.repaintBlocked = true;
	        this.inherited(arguments, [x, y]);
	        this.calculatePath();

	        this.repaintBlocked = false;
	        this.repaint();
	    },

	    calculatePath: function() {
	        if (this.shape === null) {
	            return;
	        }

	        this.svgPathString = null;
	        this.oldPoint = null;
	        this.lineSegments = new ashDraw.util.ArrayList();
	        this.basePoints = new ashDraw.util.ArrayList();
	        this.router.route(this);
	    },

	    repaint: function() {
	        if (this.repaintBlocked === true || this.shape === null) {
	            return;
	        }

	        if (this.svgPathString === null) {
	            this.calculatePath();
	        }

	        this.inherited(arguments,[{path: this.svgPathString}]);
	    },

	    onDragEnter: function(draggedFigure) {
	        this.setGlow(true);
	        return this;
	    },

	    onDragLeave: function(draggedFigure) {
	        this.setGlow(false);
	    },

	    getPoints: function() {
	        return this.basePoints;
	    },

	    getSegments: function() {
	        return this.lineSegments;
	    },

	    addPoint: function( /*:ashDraw.geo.Point*/ p) {
	        p = new ashDraw.geo.Point(p.x, p.y);
	        this.basePoints.add(p);
	        if (this.oldPoint !== null) {
	            this.lineSegments.add({
	                start: this.oldPoint,
	                end: p
	            });
	        }

	        this.oldPoint = p;
	    },

	    onOtherFigureIsMoving: function( /*:ashDraw.Figure*/ figure) {
	        this.repaintBlocked = true;
	        this.inherited(arguments, [figure]);
	        this.calculatePath();

	        this.repaintBlocked = false;
	        this.repaint();
	    },

	    hitTest: function(px, py) {
	        for (var i = 0; i < this.lineSegments.getSize(); i++) {
	            var line = this.lineSegments.get(i);
	            if (ashDraw.shape.basic.Line.hit(this.corona, line.start.x, line.start.y, line.end.x, line.end.y, px, py)) {
	                return true;
	            }
	        }
	        return false;
	    },

	    createCommand: function(request) {

	        if (request.getPolicy() === ashDraw.command.CommandType.DELETE) {
	            if (this.isDeleteable() === true) {
	                return new ashDraw.command.CommandDelete(this);
	            }
	        }

	        return null;
	    }
	});
});