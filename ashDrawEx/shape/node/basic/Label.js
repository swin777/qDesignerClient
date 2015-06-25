define(["dojo/_base/declare", "ashDraw/SetFigure"], function(declare){
	return declare("ashDrawEx.shape.node.basic.Label", ashDraw.SetFigure, {
		NAME : "ashDrawEx.shape.node.basic.Label",

		"-chains-": {
	        constructor: "manual"
	    },
		constructor: function(text) {
			this.inherited(arguments);
	        if(typeof text === "string") {
	    		this.text = text;
	    	} else {
	    		this.text = "label";
	    	}
	    	
	        // appearance of the shape
	        this.fontSize = 12;
	        this.fontColor = new ashDraw.util.Color("#080808");
	        this.padding = 4;
	        
	        // set the border width
	        this.setStroke(1);
	        
	        // behavior of the shape
	        this.editor = null;
	      	// Register a label editor with a dialog
	      	this.installEditor(new ashDraw.ui.LabelEditor());
	    },
	   
	    createSet : function()
	    {
	    	return this.canvas.paper.text(0, 0, this.text);
	    },

	    repaint: function(attributes)
	    {
	        if(this.repaintBlocked===true || this.shape===null){
	            return;
	        }

	        if(typeof attributes === "undefined"){
	            attributes = {};
	        }
	        
	        // style the label
	        var lattr = {};
	        lattr.text = this.text;
	        lattr.x = this.padding;
	        lattr.y = this.getHeight()/2;
	        lattr["text-anchor"] = "start";
	        lattr["font-size"] = this.fontSize;
	        lattr.fill = "#" + this.fontColor.hex();
	        this.svgNodes.attr(lattr);

	        this.offsetX = 0;
	        this.offsetY = 0;

	        this.inherited(arguments, [attributes]);
	    },
	    
	    isResizeable:function()
	    {
	      return false;
	    },
	   
	    setFontSize: function( size)
	    {
	      this.fontSize = size;
	      this.repaint();
	    },
	    
	    setFontColor:function( color)
	    {
	      if(color instanceof ashDraw.util.Color){
	          this.fontColor = color;
	      }
	      else if(typeof color === "string"){
	          this.fontColor = new ashDraw.util.Color(color);
	      }
	      else{
	          this.fontColor = new ashDraw.util.Color(0,0,0);
	      }
	      this.repaint();
	    },

	    getFontColor:function()
	    {
	      return this.fontColor;
	    },
	    
	    setPadding: function( padding)
	    {
	      this.padding = padding;
	      this.repaint();
	    },
	    
	    setDimension:function(/*:int*/ w, /*:int*/ h)
	    {
	    },
	   
	    getMinWidth:function()
	    {
	        return this.getWidth();
	    },
	   
	    getMinHeight:function()
	    {
	        return this.getHeight();
	    },
	    
	    installEditor: function( editor ){
	      this.editor = editor;  
	    },
	    
	    onDoubleClick: function(){
	        if(this.editor!==null){
	            this.editor.start(this);
	        }
	    },
	    
	    getText:function()
	    {
	      return this.text;
	    },
	    
	    setText:function(/*:String*/ text )
	    {
	      this.text = text;
	      
	      this.repaint();
	    },
	   
		getWidth : function() {
			if (this.shape === null) {
				return 0;
			}
			return this.svgNodes.getBBox().width+2*this.padding;
		},
	    
	    getHeight:function()
	    {
	        if (this.shape === null) {
	            return 0;
	        }
	        return this.svgNodes.getBBox().height+2*this.padding;
	    },

	    getPersistentAttributes : function()
	    {
	        var memento = this.inherited(arguments);
	        
	        memento.text = this.text;
	        
	        return memento;
	    },
	   
	    setPersistentAttributes : function(memento)
	    {
	        this.inherited(arguments, [memento]);
	        
	        if(typeof memento.text ==="string")
	        {
	            this.text = memento.text;
	        }
	    }
	});
});