dojo.declare("ashDraw.layout.locator.LeftLocator", ashDraw.layout.locator.Locator, {
    NAME : "ashDraw.layout.locator.LeftLocator",
    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function(parent){
    	this.inherited(arguments);
    },
    
    relocate:function(index, target){
       var parent = this.getParent();
       var boundingBox = parent.getBoundingBox();

       var targetBoundingBox = target.getBoundingBox();
       target.setPosition(-targetBoundingBox.w-5,(boundingBox.h/2)-(targetBoundingBox.h/2));
    }
});
