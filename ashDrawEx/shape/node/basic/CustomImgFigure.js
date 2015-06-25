define(["dojo/_base/declare", "ashDraw/shape/node/Node", "ashDrawEx/MyInputPortLocator", "ashDrawEx/MyOutputPortLocator"], function(declare){
	return declare("ashDrawEx.shape.node.basic.CustomImgFigure", ashDraw.shape.node.Node, {
		
	    NAME : "ashDrawEx.shape.node.basic.CustomImgFigure",
	   
	    "-chains-": {
	        constructor: "manual"
	    },
	    constructor: function(imgPath, width, height) {
	    	if(!width) {
				width = 50;
			}
				
			if(!height) {
				height = 50;
			}
			this.inherited(arguments, [width, height]);
			this.path = imgPath;
			this.inputLocator = new ashDrawEx.MyInputPortLocator();
			this.outputLocator = new ashDrawEx.MyOutputPortLocator();
			
			this.createPort("hybrid", this.inputLocator);
			this.createPort("hybrid", this.inputLocator);        
			this.createPort("hybrid", this.outputLocator);
			this.createPort("hybrid", this.outputLocator);
	    },
	   
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
	        
	        this.inherited(arguments, [attributes]);
	    },

	    createShapeElement : function(){
	       return this.canvas.paper.image(this.path, this.getX(), this.getY(), this.getWidth(), this.getHeight());
	    },

	    getPersistentAttributes : function(){
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
	    
	    setPersistentAttributes : function(memento){
	        this.id    = memento.id;
	        this.x     = memento.x;
	        this.y     = memento.y;
			this.path  = memento.path;
	        
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
});