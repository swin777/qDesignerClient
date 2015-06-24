/**
 * @class hatio.shape.node.basic.CustomSvgFigure
 * Customizable SVG Figure
 * 
 * @inheritable
 * @author jhnam
 * @extends graphiti.SVGFigure
 */
hatio.shape.node.basic.CustomSvgFigure = graphiti.SVGFigure.extend({

	NAME: "hatio.shape.node.basic.CustomSvgFigure",

	SVG_STR: "",
	
	node_id : "",

	/**
	 * @class MyInputPortLocator
	 * custom locator for the special design of the ResistorBridge Input area
	 *
	 * @author jhnam
	 * @extends graphiti.layout.locator.Locator
	 */
	MyInputPortLocator : graphiti.layout.locator.Locator.extend({
		init : function() {
			this._super();
		},

		relocate : function(index, figure) {
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
		init : function() {
			this._super();
		},

		relocate : function(index, figure) {
			var w = figure.getParent().getWidth();
			var h = figure.getParent().getHeight();
			figure.setPosition(w * (index - 2), h / 2);
		}
	}),

	/**
	 * @constructor
	 * 
	 * Create a new instance
	 */
	init : function(nodeId, width, height) {
		
		if(nodeId) {
			this.node_id = nodeId;
			var customNode = hatioConfig.customNodeRepo.getCustomNode(this.node_id); //Designer.app.customNodeRepo.getCustomNode(this.node_id);
			this.SVG_STR = customNode.shape_data;
			
			if(typeof width === "undefined") {
				width 	= customNode.shape_width;
			}
			if(typeof height === "undefined") {
				height	= customNode.shape_height;
			}
		} else {
			if(typeof width === "undefined") {
				width 	= 50;
			}
			if(typeof height === "undefined") {
				height	= 50;
			}
		}
		
		this._super(width, height);
		this.inputLocator = new this.MyInputPortLocator();
		this.outputLocator = new this.MyOutputPortLocator();
        
		this.createPort("hybrid",this.inputLocator);
		this.createPort("hybrid",this.inputLocator);        
		this.createPort("hybrid",this.outputLocator);
		this.createPort("hybrid",this.outputLocator);
	},
	
	getSVG : function() {
		return this.SVG_STR;
	},
	
	/**
	* @method
	* propagate all attributes like color, stroke,... to the shape element
	**/
	repaint : function(attributes) {
		if (this.repaintBlocked === true || this.shape === null) {
			return;
		}

		if(typeof attributes === "undefined") {
			attributes = {};
		}

		attributes.x = this.getAbsoluteX();
		attributes.y = this.getAbsoluteY();
		attributes.width = this.getWidth();
		attributes.height = this.getHeight();
		attributes.node_id = this.node_id;

		this._super(attributes);
	},

	/**
	 * @method 
	 * Return an objects with all important attributes for XML or JSON serialization
	 * 
	 * @returns {Object}
	 */
	getPersistentAttributes : function() {
		var memento = {
			type  	: this.NAME,
			id    	: this.id,
			x     	: this.x,
			y     	: this.y,
			width 	: this.width,
			height	: this.height,
			node_id : this.node_id,
			label   : this.label
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
	setPersistentAttributes : function(memento) {
		this.id    	  = memento.id;
		this.x     	  = memento.x;
		this.y     	  = memento.y;
		this.node_id  = memento.node_id;
		
		if(!this.SVG_STR) {
			var customNode = hatioConfig.customNodeRepo.getCustomNode(this.node_id);//Designer.app.customNodeRepo.getCustomNode(this.node_id);
			this.SVG_STR = customNode.shape_data;
		}

		// width and height are optional parameter for the JSON stuff.
		// We use the defaults if the attributes not present
		if(typeof memento.width !== "undefined") {
			this.width = memento.width;
		}

		if(typeof memento.height !== "undefined") {
			this.height= memento.height;
		}
		if(typeof memento.label !== "undefined"){
            this.setLabel(memento.label);
        }else{
        	this.setLabel("");
        }
	}
});