/**
 * @class graphiti.shape.basic.Label
 * Implements a simple text label.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var shape =  new graphiti.shape.basic.Label("This is a simple label");
 *          
 *     canvas.addFigure(shape,40,10);
 *     
 * @author Andreas Herz
 * 
 * @class graphiti.SetFigure
 */
hatio.shape.node.basic.Label= graphiti.SetFigure.extend({

	NAME : "hatio.shape.node.basic.Label",

    /**
     * @constructor
     * Creates a new text element.
     * 
     * @param {String} [text] the text to display
     */
    init : function(text)
    {
        this._super();
        
        if(typeof text === "string") {
    		this.text = text;
    	} else {
    		this.text = "label";
    	}
    	
        // appearance of the shape
        this.fontSize = 12;
        this.fontColor = new graphiti.util.Color("#080808");
        this.padding = 4;
        
        // set the border width
        this.setStroke(1);
        
        // behavior of the shape
        this.editor = null;
      	// Register a label editor with a dialog
      	this.installEditor(new graphiti.ui.LabelEditor());
    },
    
    /** 
     * @method
     * Creates the shape object for a text node.
     * 
     * @template
     **/
    createSet : function()
    {
    	return this.canvas.paper.text(0, 0, this.text);
    },

    /**
     * @method
     * Trigger the repaint of the element and transport all style properties to the visual representation.<br>
     * Called by the framework.
     * 
     * @template
     **/
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

        this._super(attributes);
    },
    

    
    /**
     * @method
     * A Label is not resizeable. In this case this method returns always <b>false</b>.
     * 
     * @returns Returns always false in the case of a Label.
     * @type boolean
     **/
    isResizeable:function()
    {
      return false;
    },
       
    
    /**
     * @method
     * Set the new font size in [pt].
     *
     * @param {Number} size The new font size in <code>pt</code>
     **/
    setFontSize: function( size)
    {
      this.fontSize = size;
      this.repaint();
    },
    
    
    /**
     * @mehod
     * Set the color of the font.
     * 
     * @param {graphiti.util.Color/String} color The new color of the line.
     **/
    setFontColor:function( color)
    {
      if(color instanceof graphiti.util.Color){
          this.fontColor = color;
      }
      else if(typeof color === "string"){
          this.fontColor = new graphiti.util.Color(color);
      }
      else{
          // set good default
          this.fontColor = new graphiti.util.Color(0,0,0);
      }
      this.repaint();
    },

    /**
     * @method
     * The current used font color
     * 
     * @returns {graphiti.util.Color}
     */
    getFontColor:function()
    {
      return this.fontColor;
    },
    
    /**
     * @method
     * Set the padding of the element
     *
     * @param {Number} padding The new padding
     **/
    setPadding: function( padding)
    {
      this.padding = padding;
      this.repaint();
    },
    
    /**
     * @method
     * A Label did have "autosize". Do nothing at all.
     *
     **/
    setDimension:function(/*:int*/ w, /*:int*/ h)
    {
        // Don't call the _super method here.
        // Dimension of a Label is autocalculated. "set" is not possible
    },
    
    /**
     * @method
     * This value is relevant for the interactive resize of the figure.
     *
     * @return {Number} Returns the min. width of this object.
     */
    getMinWidth:function()
    {
        // the minimum width of a label is always the required width.
        return this.getWidth();
    },
    
    /**
     * @method
     * This value is relevant for the interactive resize of the figure.
     *
     * @return {Number} Returns the min. width of this object.
     */
    getMinHeight:function()
    {
        // the minimum height of a label is always the required height.
        return this.getHeight();
    },
    
    /**
     * @method
     * Set an editor for the label. This can be a dialog or inplace editor for the 
     * Text.<br>
     * The editor will be activated if you doubleClick on the label.
     * 
     * @param {graphiti.ui.LabelEditor} editor
     */
    installEditor: function( editor ){
      this.editor = editor;  
    },
    
    /**
     * @method
     * Called when a user dbl clicks on the element
     * 
     * @template
     */
    onDoubleClick: function(){
        if(this.editor!==null){
            this.editor.start(this);
        }
    },
    
    
    /**
     * @method
     * Returns the current text of the label.
     *
     * @returns the current display text of the label
     * @type String
     **/
    getText:function()
    {
      return this.text;
    },
    
    /**
     * @method
     * Set the text for the label. Use \n for multiline text.
     * 
     * @param {String} text The new text for the label.
     **/
    setText:function(/*:String*/ text )
    {
      this.text = text;
      
      this.repaint();
    },
    
    /**
     * @method
     * Return the calculate width of the set. This calculates the bounding box of all elements.
     * 
     * @returns the calculated width of the label
     * @return {Number}
     **/
	getWidth : function() {
		if (this.shape === null) {
			return 0;
		}
		return this.svgNodes.getBBox().width+2*this.padding;
	},
    
    /**
     * @method
     * Return the calculated height of the set. This calculates the bounding box of all elements.
     * 
	 * @returns the calculated height of the label
	 * @return {Number}
	 */
    getHeight:function()
    {
        if (this.shape === null) {
            return 0;
        }
        return this.svgNodes.getBBox().height+2*this.padding;
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
        
        memento.text = this.text;
        
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
        
        if(typeof memento.text ==="string")
        {
            this.text = memento.text;
        }
    }
});



