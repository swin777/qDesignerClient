define(["dojo/_base/declare", "ashDraw/SVGFigure", "ashDrawEx/MyInputPortLocator", "ashDrawEx/MyOutputPortLocator"], function(declare){
	return declare("ashDrawEx.shape.node.basic.CustomSvgFigure", ashDraw.SVGFigure, {

		NAME: "ashDrawEx.shape.node.basic.CustomSvgFigure",

		SVG_STR: "",
		
		node_id : "",
		
		"-chains-": {
	        constructor: "manual"
	    },
		constructor: function(nodeId, width, height) {
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
			this.inherited(arguments, [width, height]);
			this.inputLocator = new ashDrawEx.MyInputPortLocator();
			this.outputLocator = new ashDrawEx.MyOutputPortLocator();
	        
			this.createPort("hybrid",this.inputLocator);
			this.createPort("hybrid",this.inputLocator);        
			this.createPort("hybrid",this.outputLocator);
			this.createPort("hybrid",this.outputLocator);
	    },
		
		getSVG : function() {
			return this.SVG_STR;
		},
		
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

			this.inherited(arguments, [attributes]);
		},

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

		setPersistentAttributes : function(memento) {
			this.id    	  = memento.id;
			this.x     	  = memento.x;
			this.y     	  = memento.y;
			this.node_id  = memento.node_id;
			
			if(!this.SVG_STR) {
				var customNode = hatioConfig.customNodeRepo.getCustomNode(this.node_id);//Designer.app.customNodeRepo.getCustomNode(this.node_id);
				this.SVG_STR = customNode.shape_data;
			}
			
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
});