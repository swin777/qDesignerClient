hatio.shape.node.basic.Rectangle = graphiti.shape.basic.Rectangle.extend({
    NAME : "hatio.shape.node.basic.Rectangle",

    DEFAULT_COLOR : new graphiti.util.Color("#4D90FE"),

	init : function(){
        this._super();
        
        this.setDimension(50, 50);
        this.setBackgroundColor(this.DEFAULT_COLOR);
        this.setColor(this.DEFAULT_COLOR.darker());

		this.inputLocator = new this.MyInputPortLocator();
        this.outputLocator = new this.MyOutputPortLocator();
        this.createPort("hybrid",this.inputLocator);
        this.createPort("hybrid",this.inputLocator);
        this.createPort("hybrid",this.outputLocator);
        this.createPort("hybrid",this.outputLocator);
    },
    
    MyInputPortLocator : graphiti.layout.locator.Locator.extend({
        init:function( ){
          this._super();
        },    
        relocate:function(index, figure){
            var w = figure.getParent().getWidth();
            var h = figure.getParent().getHeight();
            figure.setPosition(w/2+1, h*index);
        }
    }),

    MyOutputPortLocator : graphiti.layout.locator.Locator.extend({
        init:function( ){
          this._super();
        },    
        relocate:function(index, figure){
            var w = figure.getParent().getWidth();
            var h = figure.getParent().getHeight();
            
            figure.setPosition(w*(index-2), h/2);
        }
    }),
    
    getPersistentAttributes : function(){
        var memento = this._super();
        memento.gId = this.gId;
        memento.dx = this.dx;
        memento.dy = this.dy;        
        return memento;
    },
    
    setPersistentAttributes : function(memento){
        this._super(memento);
        this.gId = memento.gId;
        this.dx = memento.dx;
        this.dy = memento.dy;
    }
});
