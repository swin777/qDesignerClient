dojo.declare("ashDraw.decoration.connection.CircleDecorator", ashDraw.decoration.connection.Decorator, {
    NAME: "ashDraw.decoration.connection.CircleDecorator",

    "-chains-": {
        constructor: "manual"
    },
    constructor: function(width, height) {
    	this.inherited(arguments, [width, height]);
    },

    paint: function(paper) {
        var shape = paper.circle(0, 0, this.width / 2);
        shape.attr({
            fill: this.backgroundColor.hash()
        });
        return shape;
    }
});