dojo.declare("ashDraw.layout.locator.CenterLocator", ashDraw.layout.locator.Locator, {
    NAME : "ashDraw.layout.locator.CenterLocator",
    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function(parent){
    	this.inherited(arguments);
    },
    
    relocate:function(index, target){
       var parent = this.getParent();
       var boundingBox = parent.getBoundingBox();

       if(target instanceof ashDraw.shape.basic.Circle){
           target.setPosition(boundingBox.w/2,boundingBox.h/2);
       }
       else{
           var targetBoundingBox = target.getBoundingBox();
           target.setPosition(boundingBox.w/2-targetBoundingBox.w/2,boundingBox.h/2-(targetBoundingBox.h/2));
       }
    }
});
