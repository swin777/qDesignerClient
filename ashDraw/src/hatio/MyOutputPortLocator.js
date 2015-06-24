dojo.declare("hatio.MyOutputPortLocator", ashDraw.layout.locator.Locator, {
	
	"-chains-": {
        constructor: "manual"
    },
	constructor: function() {
		this.inherited(arguments);
    },
   
	relocate:function(index, figure) {
		var w = figure.getParent().getWidth();
		var h = figure.getParent().getHeight();
		figure.setPosition(w * (index - 2), h / 2);
	}
});