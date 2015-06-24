dojo.declare("hatio.shape.node.basic.Oval", ashDraw.shape.basic.Oval, {
    NAME : "hatio.shape.node.basic.Oval",

	DEFAULT_COLOR : new ashDraw.util.Color("#4D90FE"),

	"-chains-": {
        constructor: "manual"
    },
	constructor: function() {
		this.inherited(arguments, [60, 40]);
		this.createPort("input");
        this.createPort("output");

        this.setBackgroundColor(this.DEFAULT_COLOR);
        this.setColor(this.DEFAULT_COLOR.darker());
    },
    
    getPersistentAttributes : function(){
        var memento = this.inherited(arguments);
        memento.gId = this.gId;
        memento.dx = this.dx;
        memento.dy = this.dy;        
        return memento;
    },
    
    setPersistentAttributes : function(memento){
        this.inherited(arguments, [memento]);
        this.gId = memento.gId;
        this.dx = memento.dx;
        this.dy = memento.dy;
    }
});
