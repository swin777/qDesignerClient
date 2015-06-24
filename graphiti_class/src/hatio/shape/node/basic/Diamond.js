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
 *     var figure =  new hatio.shape.node.basic.Diamond();
 *     figure.setColor("#3d3d3d");
 *     
 *     canvas.addFigure(figure,60,60);
 *     
 * @extends graphiti.shape.basic.Diamond
 */
hatio.shape.node.basic.Diamond = graphiti.shape.basic.Diamond.extend({

    NAME : "hatio.shape.node.basic.Diamond",

	DEFAULT_COLOR : new graphiti.util.Color("#4D90FE"),

	init : function()
    {
        this._super(60, 60);
        
		this.createPort("input");
        this.createPort("output");

        this.setBackgroundColor(this.DEFAULT_COLOR);
        this.setColor(this.DEFAULT_COLOR.darker());
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
