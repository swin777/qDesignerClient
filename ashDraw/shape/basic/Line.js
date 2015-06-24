dojo.declare("ashDraw.shape.basic.Line", ashDraw.Figure, {
    NAME: "ashDraw.shape.basic.Line",

    DEFAULT_COLOR: new ashDraw.util.Color(0, 0, 0),
    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function(startX, startY, endX, endY) {
        this.repaintBlocked = false;

        this.corona = 10;
        this.isGlowing = false;
        this.lineColor = this.DEFAULT_COLOR;
        this.stroke = 1;

        if (typeof endY === "number") {
            this.startX = startX;
            this.startY = startY;

            this.endX = endX;
            this.endY = endY;
        } else {
            this.startX = 30;
            this.startY = 30;

            this.endX = 100;
            this.endY = 100;
        }
        this.inherited(arguments);
        this.setSelectable(true);
        this.setDeleteable(true);
    },

    setCoronaWidth: function(width) {
        this.corona = width;
    },

    createShapeElement: function() {
        return this.canvas.paper.path("M" + this.getStartX() + " " + this.getStartY() + "L" + this.getEndX() + " " + this.getEndY());
    },

    repaint: function(attributes) {
        if (this.repaintBlocked === true || this.shape === null) {
            return;
        }

        // don't override existing values
        //
        if (typeof attributes === "undefined") {
            attributes = {
                "stroke": "#" + this.lineColor.hex(),
                "stroke-width": this.stroke,
                "path": "M" + this.getStartX() + " " + this.getStartY() + "L" + this.getEndX() + " " + this.getEndY()
            };
        } else {
            if (typeof attributes.path === "undefined") {
                attributes.path = "M" + this.getStartX() + " " + this.getStartY() + "L" + this.getEndX() + " " + this.getEndY();
            }
            attributes.stroke = "#" + this.lineColor.hex();
            attributes["stroke-width"] = this.stroke;
        }

        this.inherited(arguments, [attributes]);
    },

    setGlow: function(flag) {
        if (this.isGlowing === flag) {
            return;
        }

        if (flag === true) {
            // store old values for restore
            this._lineColor = this.lineColor;
            this._stroke = this.stroke;

            this.setColor(new ashDraw.util.Color("#3f72bf"));
            this.setStroke(parseInt(this.stroke * 4));
        } else {
            this.setColor(this._lineColor);
            this.setStroke(this._stroke);
        }

        this.isGlowing = flag;
    },

    isResizeable: function() {
        return true;
    },

    setStroke: function(w) {
        this.stroke = w;

        this.repaint();
    },

    setColor: function(color) {
        if (color instanceof ashDraw.util.Color) {
            this.lineColor = color;
        } else if (typeof color === "string") {
            this.lineColor = new ashDraw.util.Color(color);
        } else {
            // set good default
            this.lineColor = this.DEFAULT_COLOR;
        }
        this.repaint();
    },

    getColor: function() {
        return this.lineColor;
    },

    setStartPoint: function(x, y) {
        if (this.startX === x && this.startY === y) {
            return;
        }

        this.startX = x;
        this.startY = y;
        this.repaint();
    },

    setEndPoint: function(x, y) {
        if (this.endX === x && this.endY === y) {
            return;
        }

        this.endX = x;
        this.endY = y;
        this.repaint();
    },

    getStartX: function() {
        return this.startX;
    },

    getStartY: function() {
        return this.startY;
    },

    getStartPoint: function() {
        return new ashDraw.geo.Point(this.startX, this.startY);
    },

    getEndX: function() {
        return this.endX;
    },


    getEndY: function() {
        return this.endY;
    },

    getEndPoint: function() {
        return new ashDraw.geo.Point(this.endX, this.endY);
    },


    getSegments: function() {
        var result = new ashDraw.util.ArrayList();
        result.add({
            start: this.getStartPoint(),
            end: this.getendPoint()
        });
        return result;
    },

    getLength: function() {
        // call native path method if possible
        if (this.shape !== null) {
            return this.shape.getTotalLength();
        }

        return Math.sqrt((this.startX - this.endX) * (this.startX - this.endX) + (this.startY - this.endY) * (this.startY - this.endY));
    },

    getAngle: function() {
        var length = this.getLength();
        var angle = -(180 / Math.PI) * Math.asin((this.startY - this.endY) / length);

        if (angle < 0) {
            if (this.endX < this.startX) {
                angle = Math.abs(angle) + 180;
            } else {
                angle = 360 - Math.abs(angle);
            }
        } else {
            if (this.endX < this.startX) {
                angle = 180 - angle;
            }
        }
        return angle;
    },

    createCommand: function(request) {
        if (request.getPolicy() === ashDraw.command.CommandType.MOVE) {
            var x1 = this.getStartX();
            var y1 = this.getStartY();
            var x2 = this.getEndX();
            var y2 = this.getEndY();
            return new ashDraw.command.CommandMoveLine(this, x1, y1, x2, y2);
        }
        if (request.getPolicy() === ashDraw.command.CommandType.DELETE) {
            if (this.isDeleteable() === false) {
                return null;
            }
            return new ashDraw.command.CommandDelete(this);
        }
        return null;
    },

    hitTest: function(px, py) {
        return ashDraw.shape.basic.Line.hit(this.corona, this.startX, this.startY, this.endX, this.endY, px, py);
    },

    intersection: function(other) {
        var result = new ashDraw.util.ArrayList();

        // empty result. the lines are equal...infinit array
        if (other === this) {
            return result;
        }

        var segments1 = this.getSegments();
        var segments2 = other.getSegments();

        segments1.each(function(i, s1) {
            segments2.each(function(j, s2) {
                var p = ashDraw.shape.basic.Line.intersection(s1.start, s1.end, s2.start, s2.end);
                if (p !== null) {
                    result.add(p);
                }
            });
        });
        return result;
    }
});

ashDraw.shape.basic.Line.intersection = function(a1, a2, b1, b2) {
    var result;

    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if (u_b != 0) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        //        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
        if (0 < ua && ua < 1 && 0 < ub && ub < 1) {
            result = new ashDraw.geo.Point(parseInt(a1.x + ua * (a2.x - a1.x)), parseInt(a1.y + ua * (a2.y - a1.y)));
        } else {
            result = null; // No Intersection;
        }
    } else {
        if (ua_t == 0 || ub_t == 0) {
            result = null; // Coincident
        } else {
            result = null; // Parallel
        }
    }

    return result;
};

ashDraw.shape.basic.Line.hit = function(coronaWidth, X1, Y1, X2, Y2, px, py) {

    X2 -= X1;
    Y2 -= Y1;

    px -= X1;
    py -= Y1;
    var dotprod = px * X2 + py * Y2;
    var projlenSq;
    if (dotprod <= 0.0) {
        projlenSq = 0.0;
    } else {
        px = X2 - px;
        py = Y2 - py;
        dotprod = px * X2 + py * Y2;
        if (dotprod <= 0.0) {
            projlenSq = 0.0;
        } else {
            projlenSq = dotprod * dotprod / (X2 * X2 + Y2 * Y2);
        }
    }
    var lenSq = px * px + py * py - projlenSq;
    if (lenSq < 0) {
        lenSq = 0;
    }
    return Math.sqrt(lenSq) < coronaWidth;
};