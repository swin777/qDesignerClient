/**
Library is under GPL License (GPL)

Copyright (c) 2012 Andreas Herz

**/



/**
 * @class graphiti.shape.basic.Rectangle
 * A Rectangle Figure.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var rect1 =  new graphiti.shape.basic.Rectangle();
 *     var rect2 =  new graphiti.shape.basic.Rectangle();
 *     
 *     canvas.addFigure(rect1,10,10);
 *     canvas.addFigure(rect2,100,10);
 *     
 *     rect2.setBackgroundColor("#f0f000");
 *     rect2.setAlpha(0.7);
 *     rect2.setDimension(100,60);
 *     rect2.setRadius(10);
 *     
 *     canvas.setCurrentSelection(rect2);
 *     
 * @author Andreas Herz
 * @extends graphiti.VectorFigure
 */
graphiti.shape.basic.Rectangle = graphiti.VectorFigure.extend({
    NAME : "graphiti.shape.basic.Rectangle",

    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     */
    init: function( width, height) {
       // corner radius
       this.radius = 2;
        
      this._super();

      this.setBackgroundColor( new graphiti.util.Color(100,100,100));
      this.setColor(new graphiti.util.Color(50,50,50));

      // set some good defaults
      //
      if(typeof width === "undefined"){
        this.setDimension(50, 90);
      }
      else{
        this.setDimension(width, height);
      }
    },

    /**
     * @inheritdoc
     **/
    repaint : function(attributes)
    {
        if(this.repaintBlocked===true || this.shape===null){
            return;
        }
        
        if (typeof attributes === "undefined") {
            attributes = {};
        }

        attributes.width = this.getWidth();
        attributes.height = this.getHeight();
        attributes.r = this.radius;
        this._super(attributes);
    },

    /**
     * @method
     * 
     * @inheritdoc
     */
    createShapeElement : function()
    {
       return this.canvas.paper.rect(this.getAbsoluteX(),this.getAbsoluteY(),this.getWidth(), this.getHeight());
    },

    /**
     * @method
     * Sets the corner radius for rectangles with round corners. 
     * 
     * @param {Number} radius
     */
     setRadius: function(radius)
     {
        this.radius = radius;
        this.repaint();
    },
    
    /**
     * @method
     * Indicates the corner radius for rectangles with round corners. The default is 2. 
     * 
     * @return {Number}
     */
    getRadius:function()
    {
        return this.radius;
    },
    
    
    
    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        var memento = this._super();
        
        memento.radius = this.radius;
        
        return memento;
    },
    
    /**
     * @method 
     * Read all attributes from the serialized properties and transfer them into the shape.
     * 
     * @param {Object} memento
     * @returns 
     */
    setPersistentAttributes : function(memento)
    {
        this._super(memento);
        
        if(typeof memento.radius ==="number")
        {
            this.radius = memento.radius;
        }
    }
    
});