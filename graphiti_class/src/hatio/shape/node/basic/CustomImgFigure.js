/**
 * @class hatio.shape.node.basic.CustomImgFigure
 * Simple Image shape.
 * 
 * @inheritable
 * @author jhnam
 * @extends graphiti.shape.node.Node
 */
hatio.shape.node.basic.CustomImgFigure = graphiti.shape.node.Node.extend({
	
    NAME : "hatio.shape.node.basic.CustomImgFigure",

	/**
	 * @class MyInputPortLocator
	 * custom locator for the special design of the ResistorBridge Input area
	 *
	 * @author jhnam
	 * @extends graphiti.layout.locator.Locator
	 */
	MyInputPortLocator : graphiti.layout.locator.Locator.extend({
		init:function() {
			this._super();
		},

		relocate:function(index, figure) {
			var w = figure.getParent().getWidth();
			var h = figure.getParent().getHeight();
			figure.setPosition(w / 2 + 1, h * index);
		}
	}),

	/**
	 * @class MyOutputPortLocator
	 * custom locator for the special design of the ResistorBridge Output area
	 *
	 * @author jhnam
	 * @extends graphiti.layout.locator.Locator
	 */
	MyOutputPortLocator : graphiti.layout.locator.Locator.extend({
		init:function() {
			this._super();
		},

		relocate:function(index, figure) {
			var w = figure.getParent().getWidth();
			var h = figure.getParent().getHeight();
			figure.setPosition(w * (index - 2), h / 2);
		}
	}),
    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     * @param {String} path relative or absolute path of the image
     * @param {Number} width initial width of the shape
     * @param {Number} height initial height of the shape
     */
    init : function(imgPath, width, height)
    {
		if(!width) {
			width = 50;
		}
			
		if(!height) {
			height = 50;
		}
			
		this._super(width, height);
		this.path = imgPath;
		this.inputLocator = new this.MyInputPortLocator();
		this.outputLocator = new this.MyOutputPortLocator();
		
		this.createPort("hybrid", this.inputLocator);
		this.createPort("hybrid", this.inputLocator);        
		this.createPort("hybrid", this.outputLocator);
		this.createPort("hybrid", this.outputLocator);
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
        var memento = {
            type  : this.NAME,
            id    : this.id,
            x     : this.x,
            y     : this.y,
            width : this.width,
            height: this.height,
			path  : this.path,
			label : this.label
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
        
        // width and height are optional parameter for the JSON stuff.
        // We use the defaults if the attributes not present
        if(typeof memento.width !== "undefined") {
            this.width = memento.width;
        }
        
        if(typeof memento.height !== "undefined") {
            this.height = memento.height;
        }
        
        if(typeof memento.label !== "undefined"){
            this.setLabel(memento.label);
        }else{
        	this.setLabel("");
        }
    }
});

