/**
Library is under GPL License (GPL)

Copyright (c) 2012 Andreas Herz

**/



/**
 * @class hatio.shape.node.basic.Circle
 * 
 * A generic Node which has many HibridPorts.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var figure =  new hatio.shape.node.basic.Circle();
 *     figure.setColor("#3d3d3d");
 *     
 *     canvas.addFigure(figure,50,10);
 *     
 * @extends graphiti.shape.basic.Circle
 */
hatio.shape.node.basic.Circle = graphiti.shape.basic.Circle.extend({

    NAME : "hatio.shape.node.basic.Circle",

	DEFAULT_COLOR : new graphiti.util.Color("#4D90FE"),

	init : function()
    {
        this._super(50);
        
		this.createPort("input");
        this.createPort("output");

        this.setBackgroundColor(this.DEFAULT_COLOR);
        this.setColor(this.DEFAULT_COLOR.darker());
    },
 
 	isStrechable:function()
    {
      return true;
    },
    
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
