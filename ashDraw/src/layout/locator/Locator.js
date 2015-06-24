dojo.declare("ashDraw.layout.locator.Locator", null, {
    NAME : "ashDraw.layout.locator.Locator",
   
    constructor: function(parentShape) {
    	this.parent = parentShape;
	},
	
    getParent:function(){
       return this.parent;
    },
    
    setParent:function(parentShape){
        this.parent= parentShape;
    },
    
    relocate:function(index, figure){
    	
    }
});