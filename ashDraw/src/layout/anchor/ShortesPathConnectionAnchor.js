dojo.declare("ashDraw.layout.anchor.ShortesPathConnectionAnchor", ashDraw.layout.anchor.ConnectionAnchor, {
    NAME: "ashDraw.layout.anchor.ShortesPathConnectionAnchor",

    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function(){
    	this.inherited(arguments);
    },

    getLocation: function(ref) {
        var r = this.getOwner().getParent().getBoundingBox();

        var octant = r.determineOctant(new ashDraw.geo.Rectangle(ref.x, ref.y, 2, 2));

        switch (octant) {
            case 0:
                return r.getTopLeft();
            case 1:
                return new ashDraw.geo.Point(ref.x, r.getTop());
            case 2:
                return r.getTopRight();
            case 3:
                return new ashDraw.geo.Point(r.getRight(), ref.y);
            case 4:
                return r.getBottomRight();
            case 5:
                return new ashDraw.geo.Point(ref.x, r.getBottom());
            case 6:
                return r.getBottomLeft();
            case 7:
                return new ashDraw.geo.Point(r.getLeft(), ref.y);
        }

        return r.getTopLeft();
    },

    getBox: function() {
        return this.getOwner().getParent().getBoundingBox();
    },

    getReferencePoint: function() {
        return this.getBox().getCenter();
    }
});