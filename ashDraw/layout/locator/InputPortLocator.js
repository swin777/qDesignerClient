dojo.declare("ashDraw.layout.locator.InputPortLocator", ashDraw.layout.locator.Locator, {
    NAME : "ashDraw.layout.locator.InputPortLocator",
    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function(){
    	this.inherited(arguments);
    },  
   
    relocate:function(index, figure){
        var node = figure.getParent();
        var h = node.getHeight();
        var gap = h/(node.getInputPorts().getSize()+1);
        figure.setPosition(0, gap*(index+1));
    } 
});



