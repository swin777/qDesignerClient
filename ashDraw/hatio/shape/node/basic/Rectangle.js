dojo.declare("hatio.shape.node.basic.Rectangle", ashDraw.shape.basic.Rectangle, {
    NAME : "hatio.shape.node.basic.Rectangle",

    DEFAULT_COLOR : new ashDraw.util.Color("#4D90FE"),
    
    "-chains-": {
        constructor: "manual"
    },
    constructor: function(){
    	this.inherited(arguments);
        this.setDimension(50, 50);
        this.setBackgroundColor(this.DEFAULT_COLOR);
        this.setColor(this.DEFAULT_COLOR.darker());

		this.inputLocator = new hatio.MyInputPortLocator();
        this.outputLocator = new hatio.MyOutputPortLocator();
        this.createPort("hybrid",this.inputLocator);
        this.createPort("hybrid",this.inputLocator);
        this.createPort("hybrid",this.outputLocator);
        this.createPort("hybrid",this.outputLocator);
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
