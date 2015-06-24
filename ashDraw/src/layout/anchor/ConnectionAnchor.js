dojo.declare("ashDraw.layout.anchor.ConnectionAnchor", null, {
    NAME: "ashDraw.layout.anchor.ConnectionAnchor",

    constructor: function(owner) {
        this.owner = owner;
    },

    getLocation: function(reference) {
        return this.getReferencePoint();
    },

    getOwner: function() {
        return this.owner;
    },

    setOwner: function(owner) {
        if (typeof owner === "undefined") {
            throw "Missing parameter for 'owner' in ConnectionAnchor.setOwner";
        }
        this.owner = owner;
    },

    getBox: function() {
        return this.getOwner().getAbsoluteBounds();
    },

    getReferencePoint: function() {
        return this.getOwner().getAbsolutePosition();
    }
});