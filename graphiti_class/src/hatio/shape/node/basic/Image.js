/**
 * @class hatio.shape.node.basic.Image
 * Simple Image shape.
 * 
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.node.Node
 */
hatio.shape.node.basic.Image = graphiti.shape.node.Node.extend({
    NAME : "hatio.shape.node.basic.Image",

    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     * @param {Number} path relative or absolute path of the image
     * @param {Number} width initial width of the shape
     * @param {Number} height initial height of the shape
     */
    init : function(width, height)
    {
		if(!width)
			width = 50;
			
		if(!height)
			height = 50;
			
        this._super(width, height);
        this.path = '/dynagram/resources/images/designer/notation/default/default-node.png';

		this.createPort("input");
        this.createPort("output");
    },
      

   /**
    * @method
    * propagate all attributes like color, stroke,... to the shape element
    **/
    repaint : function(attributes)
    {
        if (this.repaintBlocked===true || this.shape === null) {
            return;
        }

        if(typeof attributes === "undefined") {
            attributes = {};
        }

        attributes.x = this.getAbsoluteX();
        attributes.y = this.getAbsoluteY();
        attributes.width = this.getWidth();
        attributes.height = this.getHeight();
		attributes.path = this.path;
        
        this._super(attributes);
    },

    /**
     * @method
     * 
     * @inheritdoc
     */
    createShapeElement : function()
    {
       return this.canvas.paper.image(this.path, this.getX(), this.getY(), this.getWidth(), this.getHeight());
    },

    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        var memento= {
            type  : this.NAME,
            id    : this.id,
            x     : this.x,
            y     : this.y,
            width : this.width,
            height: this.height,
			path  : this.path,
			gId   : this.gId,
			dx    : this.dx,
			dy    : this.dy
        };

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
        this.id    = memento.id;
        this.x     = memento.x;
        this.y     = memento.y;
		this.path  = memento.path;
		this.gId  = memento.gId;
		this.dx  = memento.dx;
		this.dy  = memento.dy;
        
        // width and height are optional parameter for the JSON stuff.
        // We use the defaults if the attributes not present
        if(typeof memento.width !== "undefined"){
            this.width = memento.width;
        }
        
        if(typeof memento.height !== "undefined"){
            this.height= memento.height;
        }
    }
});

