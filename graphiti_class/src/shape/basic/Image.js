/**
Library is under GPL License (GPL)

Copyright (c) 2012 Andreas Herz

**/



/**
 * @class graphiti.shape.basic.Image
 * Simple Image shape.
 * 
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.node.Node
 */
graphiti.shape.basic.Image = graphiti.shape.node.Node.extend({
    NAME : "graphiti.shape.basic.Image",

    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     * @param {Number} path relative or absolute path of the image
     * @param {Number} width initial width of the shape
     * @param {Number} height initial height of the shape
     */
    init : function(path,  width, height)
    {
        this._super(width, height);
        this.path = path;
    },
      

   /**
    * @method
    * propagate all attributes like color, stroke,... to the shape element
    **/
    repaint : function(attributes)
    {
        if (this.repaintBlocked===true || this.shape === null){
            return;
        }

        if(typeof attributes === "undefined" ){
            attributes = {};
        }

        attributes.x = this.getAbsoluteX();
        attributes.y = this.getAbsoluteY();
        attributes.width = this.getWidth();
        attributes.height = this.getHeight();
        
        this._super(attributes);
    },

    /**
     * @method
     * 
     * @inheritdoc
     */
    createShapeElement : function()
    {
       return this.canvas.paper.image(this.path,this.getX(),this.getY(),this.getWidth(), this.getHeight());
    }


});

