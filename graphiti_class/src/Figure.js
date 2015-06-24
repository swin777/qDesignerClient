/**
Library is under GPL License (GPL)

Copyright (c) 2012 Andreas Herz

**/


/**
 * @class graphiti.Figure
 * A lightweight graphical object. Figures are rendered to a {@link graphiti.Canvas} object.
 * 
 * @inheritable
 * @author Andreas Herz
 */
graphiti.Figure = Class.extend({
    
	NAME : "graphiti.Figure",
    
	MIN_TIMER_INTERVAL: 50, // minimum timer interval in milliseconds
	
    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     * @param {Number} [width] initial width of the shape
     * @param {Number} [height] initial height of the shape
     */
    init: function( width, height ) {
    	this.name = "graphiti.Figure";
        this.id = graphiti.util.UUID.create();

        // for undo/redo operation. It holds the command during a drag/drop operation
        // and execute it on the CommandStack if the user drop the figure.
        this.command = null;
        
        this.canvas = null;
        this.shape  = null;
        
        // possible decorations ( e.g. a Label) of the Connection
        this.children = new graphiti.util.ArrayList();
            
        // behavior flags
        //
        this.selectable = true;
        this.deleteable = true;
        this.resizeable = true;
        this.draggable = true;
        this.visible = true;
        
        this.canSnapToHelper = true;
        this.snapToGridAnchor = new graphiti.geo.Point(0,0);    // hot spot for snap to grid  
        this.editPolicy = new graphiti.util.ArrayList(); // List<graphiti.layout.constraint.EditPolicy)
        
        // timer for animation or automatic update
        //
        this.timerId = -1;
        this.timerInterval = 0;
        
        // possible parent of the figure. 
        //
        this.parent = null;
        
        // appearance, position and dim properties
        //
        this.x = 0;
        this.y = 0;
        this.rotationAngle = 0;
        
        this.minHeight = 5;
        this.minWidth = 5;
        
        if(typeof height !== "undefined"){
            this.width  = width;
            this.height = height;
        }
        else{
           this.width  = this.getMinWidth();
           this.height = this.getMinHeight();
        }
        this.alpha = 1.0;
        
        // internal status flags for the Drag&Drop operation handling and other stuff
        //
        this.isInDragDrop =false;
        this.isMoving = false;
        this.originalAlpha = this.alpha;
        this.ox = 0;
        this.oy = 0;
        this.repaintBlocked=false;
        
        // listener for movement. required for Ports or property panes in the UI
        //
        this.moveListener = new graphiti.util.ArrayList();
        
        this.label = "";
    },
    

    /**
     * @method
     * Callback to update the visibility of the resize handles
     * 
     * @param {graphiti.Canvas} canvas
     * @param {graphiti.ResizeHandle} resizeHandle1 topLeft resize handle
     * @param {graphiti.ResizeHandle} resizeHandle2 topCenter resize handle
     * @param {graphiti.ResizeHandle} resizeHandle3 topRight resize handle
     * @param {graphiti.ResizeHandle} resizeHandle4 rightMiddle resize handle
     * @param {graphiti.ResizeHandle} resizeHandle5 bottomRight resize handle
     * @param {graphiti.ResizeHandle} resizeHandle6 bottomCenter resize handle
     * @param {graphiti.ResizeHandle} resizeHandle7 bottomLeft resize handle
     * @param {graphiti.ResizeHandle} resizeHandle8 leftMiddle resize handle
     * @template
     */
    showResizeHandles: function(canvas, resizeHandle1, resizeHandle2, resizeHandle3, resizeHandle4, resizeHandle5, resizeHandle6, resizeHandle7, resizeHandle8, volatilePort){
    	
        resizeHandle1.show(canvas,0,0);
        resizeHandle3.show(canvas,0,0);
        resizeHandle5.show(canvas,0,0);
        resizeHandle7.show(canvas,0,0);

        resizeHandle1.setDraggable(this.isResizeable());
        resizeHandle3.setDraggable(this.isResizeable());
        resizeHandle5.setDraggable(this.isResizeable());
        resizeHandle7.setDraggable(this.isResizeable());

        if(this.isResizeable()===true)
        {
          resizeHandle1.setBackgroundColor(resizeHandle1.DEFAULT_COLOR);
          resizeHandle3.setBackgroundColor(resizeHandle3.DEFAULT_COLOR);
          resizeHandle5.setBackgroundColor(resizeHandle5.DEFAULT_COLOR);
          resizeHandle7.setBackgroundColor(resizeHandle7.DEFAULT_COLOR);
        }
        else
        {
          resizeHandle1.setBackgroundColor(null);
          resizeHandle3.setBackgroundColor(null);
          resizeHandle5.setBackgroundColor(null);
          resizeHandle7.setBackgroundColor(null);
        }

        if(this.isStrechable() && this.isResizeable())
        {
          resizeHandle2.setDraggable(this.isResizeable());
          resizeHandle4.setDraggable(this.isResizeable());
          resizeHandle6.setDraggable(this.isResizeable());
          resizeHandle8.setDraggable(this.isResizeable());
          resizeHandle2.show(canvas,0,0);
          resizeHandle4.show(canvas,0,0);
          resizeHandle6.show(canvas,0,0);
          resizeHandle8.show(canvas,0,0);
          volatilePort.show(canvas, 0,0, this)
        }
        
        this.moveResizeHandles(canvas, resizeHandle1, resizeHandle2, resizeHandle3, resizeHandle4, resizeHandle5, resizeHandle6, resizeHandle7, resizeHandle8, volatilePort);
    },
    
    /**
     * @param canvas
     * @param resizeHandle1
     * @param resizeHandle2
     * @param resizeHandle3
     * @param resizeHandle4
     * @param resizeHandle5
     * @param resizeHandle6
     * @param resizeHandle7
     * @param resizeHandle8
     */
    moveResizeHandles:function(canvas, resizeHandle1, resizeHandle2, resizeHandle3, resizeHandle4, resizeHandle5, resizeHandle6, resizeHandle7, resizeHandle8, volatilePort)
    {
        var objHeight   = this.getHeight();
        var objWidth    = this.getWidth();
        var xPos = this.getX();
        var yPos = this.getY();
        if (   typeof resizeHandle1 == "undefined" 
			|| typeof resizeHandle2 == "undefined" 
			|| typeof resizeHandle3 == "undefined"
			|| typeof resizeHandle4 == "undefined"
			|| typeof resizeHandle5 == "undefined"
			|| typeof resizeHandle6 == "undefined"
			|| typeof resizeHandle7 == "undefined"
			|| typeof resizeHandle8 == "undefined"
			|| typeof volatilePort == "undefined"){
        	return;
        }
        
        if(this.isStrechable())
        {
          resizeHandle1.setPosition(xPos-resizeHandle1.getWidth(),yPos-resizeHandle1.getHeight());
          resizeHandle3.setPosition(xPos+objWidth,yPos-resizeHandle3.getHeight());
          resizeHandle5.setPosition(xPos+objWidth,yPos+objHeight);
          resizeHandle7.setPosition(xPos-resizeHandle7.getWidth(),yPos+objHeight);	
          resizeHandle2.setPosition(xPos+(objWidth/2)-(resizeHandle2.getWidth()/2),yPos-resizeHandle2.getHeight());
          resizeHandle4.setPosition(xPos+objWidth,yPos+(objHeight/2)-(resizeHandle4.getHeight()/2));
          resizeHandle6.setPosition(xPos+(objWidth/2)-(resizeHandle6.getWidth()/2),yPos+objHeight);
          resizeHandle8.setPosition(xPos-resizeHandle8.getWidth(),yPos+(objHeight/2)-(resizeHandle8.getHeight()/2));
          volatilePort.setPosition(xPos+(objWidth/2), yPos+(objHeight/2))
        }
    },
    
    /**
     * @method
     * Return the UUID of this element. 
     * 
     * @return {String}
     */
    getId: function()
    {
       return this.id; 
    },
    
    /**
     * @method
     * Set the id of this element. 
     * 
     * @param {String} id the new id for this figure
     */
    setId: function(id)
    {
        this.id = id; 
    },
    
    /**
     * @method
     * Set the canvas element of this figures.
     * 
     * @param {graphiti.Canvas} canvas the new parent of the figure or null
     */
    setCanvas: function( canvas )
    {
      // remove the shape if we reset the canvas and the element
      // was already drawn
      if(canvas===null && this.shape!==null)
      {
         this.shape.remove();
         this.shape=null;
      }
     
      this.canvas = canvas;
      
      if(this.canvas!==null){
          this.getShapeElement();
      }

      if(canvas === null){
    	  this.stopTimer();
      }
      else{
    	  if(this.timerInterval>= this.MIN_TIMER_INTERVAL){
              this.startTimer(this.timerInterval);
    	  }
      }
      
      for(var i=0; i<this.children.getSize();i++){
          var entry = this.children.get(i);
          entry.figure.setCanvas(canvas);
      }
      
      if(this.shape!==null){
      	_canvas = this.canvas;
      	this.shape.mouseover(this.mouseoverHandler);
      	this.shape.mouseout(this.mouseoutHandler);
      	this.shape.mousedown(this.mousedownHandler)
      	this.shape.parentFigure = this;
      }
     },
     
     _canvas : null,
     
     /**
      * @method
      * Return the current assigned canvas container.
      * 
      * @return {graphiti.Canvas}
      */
     getCanvas:function()
     {
         return this.canvas;
     },
     
    
     /**
      * @method
      * Start a timer which calles the onTimer method in the given interval.
      * 
      * @param {Number} milliSeconds
      */
     startTimer: function(milliSeconds, callback)
     {
    	 this.stopTimer();
    	 this.timerInterval = Math.max(this.MIN_TIMER_INTERVAL, milliSeconds);
    	 
    	 if(this.canvas!==null){
    	 	if(callback){
    	 		this.timerId = window.setInterval($.proxy(callback,this), this.timerInterval);
    	 	}else{
    	 		this.timerId = window.setInterval($.proxy(this.onTimer,this), this.timerInterval);
    	 	}
    	 }
     },

     /**
      * @method
      * Stop the internal timer.
      * 
      */
     stopTimer: function()
     {
    	if(this.timerId>=0){
  		  window.clearInterval(this.timerId);
		  this.timerId=-1;
    	} 
     },

     /**
      * @method
      * Callback method for the internal timer handling<br>
      * Inherit classes must override this method if they want use the timer feature.
      * 
      * @template
      */
     onTimer: function()
     {
    	
     },
     
     /**
      * Install a new edit policy to the figure. Each editpolicy is able to focus on a single editing 
      * task or group of related tasks. This also allows editing behavior to be selectively reused across 
      * different figure implementations. Also, behavior can change dynamically, such as when the layouts 
      * or routing methods change.
      * Example for limited DragDrop behaviour can be a graphiti.layout.constraint.RegionConstriantPolicy.
      * 
      * @param {graphiti.policy.EditPolicy} policy
      */
     installEditPolicy: function(policy)
     {
         this.editPolicy.add(policy);
     },
     
     /**
      * @method
      * Add a child figure to the figure. The hands over figure doesn't support drag&drop 
      * operations. It's only a decorator for the connection.<br>
      * Mainly for labels or other fancy decorations :-)
      *
      * @param {graphiti.Figure} figure the figure to add as decoration to the connection.
      * @param {graphiti.layout.locator.Locator} locator the locator for the child. 
     **/
     addFigure : function(child, locator)
     {
         // the child is now a slave of the parent
         //
         child.setDraggable(false);
         child.setSelectable(false);
         child.setParent(this);
         
         var entry = {};
         entry.figure = child;
         entry.locator = locator;

         this.children.add(entry);
         
         if(this.canvas!==null){
             child.setCanvas(this.canvas);
         }
         
         this.repaint();
     },

     /**
      * @method
      * Return all children/decorations of this shape
      */
     getChildren : function(){
         var shapes = new graphiti.util.ArrayList();
         this.children.each(function(i,e){
             shapes.add(e.figure);
         });
         return shapes;
     },
     

     /**
      * @method
      * Remove all children/decorations of this shape
      * 
      */
     resetChildren : function(){
         this.children.each(function(i,e){
             e.figure.setCanvas(null);
         });
         this.children= new graphiti.util.ArrayList();
         this.repaint();
     },
     

     /**
     * @method
     * return the current SVG shape element or create it on demand.
     * 
     * @final
     */
    getShapeElement:function()
    {
       if(this.shape!==null){
         return this.shape;
       }

      this.shape=this.createShapeElement();
      return this.shape;
    },


    /**
     * @method
     * Inherited classes must override this method to implement it's own draw functionality.
     * 
     * @template
     * @abstract
     */
    createShapeElement : function()
    {
        throw "Inherited class ["+this.NAME+"] must override the abstract method createShapeElement";
    },


    /**
     * @method
     * propagate all attributes like color, stroke,... to the shape element
     * 
     **/
     repaint : function(attributes)
     {
         if (this.repaintBlocked===true || this.shape === null){
             return;
         }

         if(typeof attributes === "undefined" ){
             attributes = {};
         }

         if(this.visible===true){
        	 this.shape.show();
         }
         else{
        	 this.shape.hide();
        	 return;
         }
         
         // enrich with common properties
         attributes.opacity = this.alpha;
         
         if(this.rotationAngle!==0){
             this.shape.transform("r"+this.rotationAngle+"," + this.getAbsoluteX() + "," + this.getAbsoluteY());
         }
         else{
             this.shape.transform("");
         }
         
         this.shape.attr(attributes);
        
        // Relocate all children of the figure.
        // This means that the Locater can calculate the new Position of the child.
        //
        for(var i=0; i<this.children.getSize();i++) {
            var entry = this.children.get(i);
            entry.locator.relocate(i, entry.figure);
        }
     },
     
     /**
      * @method
      * Highlight the element or remove the highlighting
      * 
      * @param {Boolean} flag indicates glow/noGlow
      * @template
      */
     setGlow: function(flag){
    	 // do nothing in the base class. 
    	 // Subclasses must implement this method.
     },
     

    /**
     * @method
     * Will be called if the drag and drop action begins. You can return [false] if you
     * want avoid that the figure can be move.
     * 
     * @param {Number} relativeX the x coordinate within the figure
     * @param {Number} relativeY the y-coordinate within the figure.
     * 
     * @return {boolean} true if the figure accepts dragging
     **/
    onDragStart : function(relativeX, relativeY )
    {
      this.isInDragDrop =false;
      this.isMoving = false;
      this.originalAlpha = this.getAlpha();

      this.command = this.createCommand(new graphiti.command.CommandType(graphiti.command.CommandType.MOVE));

      if(this.command!==null){
         this.ox = this.x;
         this.oy = this.y;
         this.isInDragDrop =true;
         return true;
      }
      
      return false;
    },

    /**
     * @method
     * Don't call them manually. This will be done by the framework.<br>
     * Will be called if the object are moved via drag and drop.
     * Sub classes can override this method to implement additional stuff. Don't forget to call
     * the super implementation via <code>Figure.prototype.onDrag.call(this);</code>
     * @private
     * @param {Number} dx the x difference between the start of the drag drop operation and now
     * @param {Number} dy the y difference between the start of the drag drop operation and now
     **/
    onDrag : function( dx,  dy)
    {
      // apply all EditPolicy for DragDrop Operations
      //
      this.editPolicy.each($.proxy(function(i,e){
            if(e.getRole()===graphiti.policy.EditPolicy.Role.PRIMARY_DRAG_ROLE){
                var newPos = e.apply(this,this.ox+dx,this.oy+dy);
                dx = newPos.x-this.ox;
                dy = newPos.y-this.oy;
            }
      },this));
        
      this.x = this.ox+dx;
      this.y = this.oy+dy;

      // Adjust the new location if the object can snap to a helper
      // like grid, geometry, ruler,...
      //
      if(this.getCanSnapToHelper())
      {
        var p = new graphiti.geo.Point(this.x,this.y);
        p = this.getCanvas().snapToHelper(this, p);
        this.x = p.x;
        this.y = p.y;
      }

      
      this.setPosition(this.x, this.y);
      

      // enable the alpha blending of the first real move of the object
      //
      if(this.isMoving===false)
      {
       this.isMoving = true;
       this.setAlpha(this.originalAlpha*0.7);
      }
    },

    /**
     * @method
     * Called by the framework if the figure returns false for the drag operation. In this
     * case we send a "panning" event - mouseDown + mouseMove. This is very useful for
     * UI-Widget like slider, spinner,...
     * 
     * @param {Number} dx the x difference between the mouse down operation and now
     * @param {Number} dy the y difference between the mouse down operation and now
     * @template
     */
    onPanning: function(dx, dy){
        
    },
    
    
    /**
     * @method
     * Will be called after a drag and drop action.<br>
     * Sub classes can override this method to implement additional stuff. Don't forget to call
     * the super implementation via <code>this._super();</code>
     * 
     * @template
     **/
    onDragEnd : function()
    {
      this.setAlpha(this.originalAlpha);
  
      // Element ist zwar schon an seine Position, das Command muss aber trotzdem
      // in dem CommandStack gelegt werden damit das Undo funktioniert.
      //
      if(this.canvas.getSnapToGrid()){
        	var tmpX = this.x/10;
        	var tmpY = this.y/10;
        	this.x = Math.round(tmpX) * 10;
        	this.y = Math.round(tmpY) * 10;
      }
      this.command.setPosition(this.x, this.y);
      this.isInDragDrop = false;

      this.canvas.commandStack.execute(this.command);
      this.command = null;
      this.isMoving = false;
      this.fireMoveEvent();
    },

    /**
     * @method
     * Called by the framework during drag&drop operations.
     * 
     * @param {graphiti.Figure} figure The figure which is currently dragging
     * 
     * @return {graphiti.Figure} the figure which should receive the drop event or null if the element didnt want a drop event
     * @template
     **/
    onDragEnter : function( draggedFigure )
    {
    	return null;
    },
 
    /**
     * @method
     * Called if the DragDrop object leaving the current hover figure.
     * 
     * @param {graphiti.Figure} figure The figure which is currently dragging
     * @template
     **/
    onDragLeave:function( draggedFigure )
    {
    },

    
    /**
     * @method
     * Called if the user drop this element onto the dropTarget
     * 
     * @param {graphiti.Figure} dropTarget The drop target.
     * @private
     **/
    onDrop:function(dropTarget)
    {
    },
   

    /**
     * @method
     * Callback method for the mouse enter event. Usefull for mouse hover-effects.
     * Override this method for yourown effects. Don't call them manually.
     *
     * @template
     **/
    onMouseEnter:function()
    {
    },
    
    
    /**
     * @method
     * Callback method for the mouse leave event. Usefull for mouse hover-effects.
     * 
     * @template
     **/
    onMouseLeave:function()
    {
    },

    /**
     * @method
     * Called when a user dbl clicks on the element
     * 
     * @template
     */
    onDoubleClick: function(){
    },
    
    
    /**
     * @method
     * Called when a user clicks on the element.
     * 
     * @template
     */
    onClick: function(){
    },
   
    /**
     * @method
     * called by the framework if the figure should show the contextmenu.</br>
     * The strategy to show the context menu depends on the plattform. Either loooong press or
     * right click with the mouse.
     * 
     * @param {Number} x the x-coordinate to show the menu
     * @param {Number} y the y-coordinate to show the menu
     * @since 1.1.0
     * @template
     */
    onContextMenu:function(x,y){

    },

    /**
     * @method
     * Set the alpha blending of this figure. 
     *
     * @template
     * @param {Number} percent Value between [0..1].
     **/
    setAlpha:function( percent)
    {
      if(percent===this.alpha){
         return;
      }

      this.alpha = percent;
      this.repaint();
    },

        
    /**
     * @method Return the alpha blending of the figure
     * @return {Number}
     */
    getAlpha : function()
    {
        return this.alpha;
    },
    
    
    /**
     * @method
     * set the rotation angle in degree [0..356]<br>
     * <br>
     * <b>NOTE: this method is pre alpha and not for production.</b>
     * <br>
     * @param {Number} angle the rotation angle in degree
     */
    setRotationAngle: function(angle){
        this.rotationAngle = angle;
        
        this.repaint();
    },
    
    
    /**
     * @method
     * show/hide the element
     * 
     * @param {Boolean} flag
     * @since 1.1.0
     */
    setVisible: function(flag){
    	this.visible = flag;
    	
    	this.repaint();
    },
    
    /**
     * @method
     * Return true if the figure visible.
     * 
     * @return {Boolean}
     * @since 1.1.0
     */
    isVisible: function(){
        return this.visible && this.shape!==null;
    },
    
    /**
     * @method
     * Return the current z-index of the element. Currently this is an expensive method. The index will be calculated
     * all the time. Cacheing is not implemented at the moment.
     * 
     * @return {Number}
     */
    getZOrder: function(){
        if(this.shape===null){
            return -1;
        }
        
        var i = 0;
        var child = this.shape.node;
        while( (child = child.previousSibling) !== null ) {
          i++;
        }
        return i;
    },
    
    /**
     * @method
     * Set the flag if this object can snap to grid or geometry.
     * A window of dialog should set this flag to false.
     * 
     * @param {boolean} flag The snap to grid/geometry enable flag.
     *
     **/
    setCanSnapToHelper:function(/*:boolean */flag)
    {
      this.canSnapToHelper = flag;
    },

    /**
     * @method
     * Returns true if the figure can snap to any helper like a grid, guide, geometrie
     * or something else.
     *
     * @return {boolean}
     **/
    getCanSnapToHelper:function()
    {
      return this.canSnapToHelper;
    },

    /**
     *
     * @return {graphiti.geo.Point}
     **/
    getSnapToGridAnchor:function()
    {
      return this.snapToGridAnchor;
    },

    /**
     * @method
     * Set the hot spot for all snapTo### operations.
     * 
     * @param {graphiti.geo.Point} point
     **/
    setSnapToGridAnchor:function(point)
    {
      this.snapToGridAnchor = point;
    },

    /**
     * @method
     * The current width of the figure.
     * 
     * @type {Number}
     **/
    getWidth:function()
    {
      return this.width;
    },

    /**
     * @method 
     * The current height of the figure.
     * 
     * @type {Number}
     **/
    getHeight:function()
    {
      return this.height;
    },


    /**
     * @method
     * This value is relevant for the interactive resize of the figure.
     *
     * @return {Number} Returns the min. width of this object.
     */
    getMinWidth:function()
    {
      return this.minWidth;
    },

    /**
     * @method
     * Set the minimum width of this figure
     * 
     * @param {Number} w
     */
    setMinWidth: function(w){
      this.minWidth = w;
    },
    
    /**
     * @method
     * This value is relevant for the interactive resize of the figure.
     *
     * @return {Number} Returns the min. height of this object.
     */
    getMinHeight:function()
    {
      return this.minHeight;
    },

    /**
     * @method
     * Set the minimum heigth of the figure.
     * 
     * @param {Number} h
     */
    setMinHeight:function(h){
        this.minHeight = h;
    },
    
    /**
     * @method
     * The x-offset related to the parent figure or canvas.
     * 
     * @return {Number} the x-offset to the parent figure
     **/
    getX :function()
    {
        return this.x;
    },

    /**
     * @method
     * The y-offset related to the parent figure or canvas.
     * 
     * @return {Number} The y-offset to the parent figure.
     **/
    getY :function()
    {
        return this.y;
    },

    
    /**
     * @method
     * The x-offset related to the canvas.
     * 
     * @return {Number} the x-offset to the parent figure
     **/
    getAbsoluteX :function()
    {
        if(this.parent===null){
            return this.x;
        }
        return this.x + this.parent.getAbsoluteX();  
    },


    /**
     * @method
     * The y-offset related to the canvas.
     * 
     * @return {Number} The y-offset to the parent figure.
     **/
    getAbsoluteY :function()
    {
        if(this.parent ===null){
            return this.y;
        }
        return this.y + this.parent.getAbsoluteY();  
    },


    /**
     * @method
     * Returns the absolute y-position of the port.
     *
     * @type {graphiti.geo.Point}
     **/
    getAbsolutePosition:function()
    {
      return new graphiti.geo.Point(this.getAbsoluteX(), this.getAbsoluteY());
    },
    
    /**
     * @method
     * Returns the absolute y-position of the port.
     *
     * @return {graphiti.geo.Rectangle}
     **/
    getAbsoluteBounds:function()
    {
      return new graphiti.geo.Rectangle(this.getAbsoluteX(), this.getAbsoluteY(),this.getWidth(),this.getHeight());
    },
    

    /**
     * @method
     * Set the position of the object.
     *
     * @param {Number} x The new x coordinate of the figure
     * @param {Number} y The new y coordinate of the figure 
     **/
    setPosition:function(x , y )
    {
      this.x= x;
      this.y= y;

      this.repaint();

      // Update the resize handles if the user change the position of the element via an API call.
      //
      if(this.canvas!==null){
         this.canvas.moveResizeHandles(this);
      }
      this.fireMoveEvent();
    },
    
    /**
     * @method
     * Translate the figure with the given x/y offset.
     *
     * @param {Number} dx The new x translate offset
     * @param {Number} dy The new y translate offset
     **/
    translate:function(dx , dy )
    {
    	this.setPosition(this.x+dx,this.y+dy);
    },
    
    
    /**
     * @method
     * Set the new width and height of the figure. 
     *
     * @param {Number} w The new width of the figure
     * @param {Number} h The new height of the figure
     **/
    setDimension:function(w, h)
    {
      this.width = Math.max(this.getMinWidth(),w);
      this.height= Math.max(this.getMinHeight(),h);
      
      this.repaint();
      
      this.fireMoveEvent();

      // Update the resize handles if the user change the dimension via an API call
      //
      if(this.canvas!==null )  {
         this.canvas.moveResizeHandles(this);
      }
    },


    /**
     * @method
     * Return the bounding box of the figure in absolute position to the canvas.
     * 
     * @return {graphiti.geo.Rectangle}
     **/
    getBoundingBox:function()
    {
      return new graphiti.geo.Rectangle(this.getAbsoluteX(),this.getAbsoluteY(),this.getWidth(),this.getHeight());
    },

    /**
     * @method
     * Detect whenever the hands over coordinate is inside the figure.
     *
     * @param {Number} iX
     * @param {Number} iY
     * @returns {Boolean}
     */
    hitTest : function ( iX , iY)
    {
        var x = this.getAbsoluteX();
        var y = this.getAbsoluteY();
        var iX2 = x + this.getWidth();
        var iY2 = y + this.getHeight();
        return (iX >= x && iX <= iX2 && iY >= y && iY <= iY2);
    },


    /**
     * @method
     * Switch on/off the drag drop behaviour of this object
     *
     * @param {Boolean} flag The new drag drop indicator
     **/
    setDraggable:function(flag)
    {
      this.draggable= flag;
    },

    /**
     * @method
     * Get the Drag drop enable flag
     *
     * @return {boolean} The new drag drop indicator
     **/
    isDraggable:function()
    {
      return this.draggable;
    },


    /**
     * @method
     * Returns the true if the figure can be resized.
     *
     * @return {boolean}
     **/
    isResizeable:function()
    {
      return this.resizeable;
    },

    /**
     * @method
     * You can change the resizeable behaviour of this object. Hands over [false] and
     * the figure has no resizehandles if you select them with the mouse.<br>
     *
     * @param {boolean} flag The resizeable flag.
     **/
    setResizeable:function(flag)
    {
      this.resizeable=flag;
    },

    /**
     * @method
     * Indicates whenever the element is selectable by user interaction or API.
     * 
     * @return {boolean}
     **/
    isSelectable:function()
    {
      return this.selectable;
    },


    /**
     * @method
     * You can change the selectable behavior of this object. Hands over [false] and
     * the figure has no selection handles if you try to select them with the mouse.<br>
     *
     * @param {boolean} flag The selectable flag.
     **/
    setSelectable:function(flag)
    {
      this.selectable=flag;
    },

    /**
     * @method
     * Return true if the object doesn't care about the aspect ratio.
     * You can change the height and width independent.
     * 
     * @return {boolean}
     */
    isStrechable:function()
    {
      return true;
    },

    /**
     * @method
     * Return false if you avoid that the user can delete your figure.
     * Sub class can override this method.
     * 
     * @return {boolean}
     **/
    isDeleteable:function()
    {
      return this.deleteable;
    },

    /**
     * @method
     * Return false if you avoid that the user can delete your figure.
     * 
     * @param {boolean} flag Enable or disable flag for the delete operation
     **/
    setDeleteable:function(flag)
    {
      this.deleteable = flag;
    },

    /**
     * @method
     * Set the parent of this figure.
     * Don't call them manually.

     * @param {graphiti.Figure} parent The new parent of this figure
     * @private
     **/
    setParent:function( parent)
    {
      this.parent = parent;
    },

    /**
     * @method
     * Get the parent of this figure.
     *
     * @return {graphiti.Figure}
     **/
    getParent:function()
    {
      return this.parent;
    },

    /**
     * @method
     * Register the hands over object as a moveListener of this figure.<br>
     * All position changes will be broadcast to all move listener. This is
     * useful for Connectors and Layouter for router handling.
     *
     * @param {Object} listener the listener to call
     *
     **/
     attachMoveListener:function(listener) {
		if (listener === null) {
			return;
		}

		this.moveListener.add(listener);
 	 },
 

    /**
     * @method
     * Remove the hands over figure from notification queue.
     *
     * @param {graphiti.Figure} figure The figure to remove the monitor
     *
     **/
    detachMoveListener:function(figure) 
    {
      if(figure===null || this.moveListener===null){
        return;
      }

      this.moveListener.remove(figure);
    },

    /**
     * @method
     * Called from the figure itself when any position changes happens. All listener
     * will be informed.
     * 
     * @private
     **/
    fireMoveEvent: function()
    {
        // first call. Reured for connections to update the routing,...
        //
        this.moveListener.each($.proxy(function(i, item){
            item.onOtherFigureIsMoving(this);
        },this));
        
    },
    
    /**
     * @method
     * Fired if a figure is moving.
     *
     * @param {graphiti.Figure} figure The figure which has changed its position
     * @template
     */
    onOtherFigureIsMoving:function(figure){
    },
    
    /**
     * @method
     * Returns the Command to perform the specified Request or null.
      *
     * @param {graphiti.command.CommandType} request describes the Command being requested
     * @return {graphiti.command.Command} null or a Command
     **/
    createCommand:function( request)
    {
      if(request===null){
          return null;
      }
      
      if(request.getPolicy() === graphiti.command.CommandType.MOVE)
      {
        if(!this.isDraggable()){
          return null;
        }
        return new graphiti.command.CommandMove(this);
      }

      if(request.getPolicy() === graphiti.command.CommandType.DELETE)
      {
        if(!this.isDeleteable()){
           return null;
        }
        return new graphiti.command.CommandDelete(this);
      }
      
      if(request.getPolicy() === graphiti.command.CommandType.RESIZE)
      {
        if(!this.isResizeable()){
           return null;
        }
        return new graphiti.command.CommandResize(this);
      }
      
      return null;
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
        
        // width and height are optional parameter for the JSON stuff.
        // We use the defaults if the attributes not present
        if(typeof memento.width !== "undefined"){
            this.width = memento.width;
        }
        
        if(typeof memento.height !== "undefined"){
            this.height= memento.height;
        }
        
        if(typeof memento.label !== "undefined"){
            this.setLabel(memento.label);
        }else{
        	this.setLabel("");
        }
    },
    
    mousedownHandler:function(event){
    	try{
    		_canvas.onMouseDown(event.layerX, event.layerY, this.parentFigure);
    	}catch(e){}
    }, 
    
    mouseoverHandler:function(event){
    	try{
    		_canvas.onMouseOver(event.layerX, event.layerY, this.parentFigure);
    	}catch(e){}
    },  
    
    mouseoutHandler:function(event){
    	try{
    		_canvas.onMouseOut(event.layerX, event.layerY, this.parentFigure);
    	}catch(e){}
    },
    
    setArr : function (el, attr) {
        if (attr) {
			for ( var key in attr)
				if (attr.hasOwnProperty(key)) {
					el.setAttribute(key, attr[key]);
				}
		} else {
			return document.createElementNS("http://www.w3.org/2000/svg", el);
		}
    },
    
    onBlackAndWhite : function(){
    	var filterAtt = this.shape.node.getAttribute("filter");
    	this.setArr(this.shape.node, {filter: "url(#blackAndWhite)"});	
    }, 
    
    offBlackAndWhite : function(){
    	this.setArr(this.shape.node, {filter: ""});	
    },
    
    onBlackAndWhiteToogle : function(){
    	var filterAtt = this.shape.node.getAttribute("filter");
    	if(filterAtt==null || typeof filterAtt == "undefined" || filterAtt==""){
    		this.setArr(this.shape.node, {filter: "url(#blackAndWhite)"});	
    	}else{
    		this.setArr(this.shape.node, {filter: ""});	
    	}
    }, 
    
    onGlow : function(){
    	this.glowObj = this.shape.glow({color:"#00ff00", width:25, fill:true, opacity:0.8});
    },
    
    onGlowToogle : function(){
    	if(!this.glowObj){
    		this.glowObj = this.shape.glow({color:"#00ff00", width:25, fill:true, opacity:0.8});
    	}else{
    		this.glowObj.remove();
    		this.glowObj = null;
    	}
    },
    
    offGlow : function(){
    	if(this.glowObj){
    		this.glowObj.remove();
    		this.glowObj = null;
    	}
    },
    
    onGlowToogleStart : function(){
    	this.startTimer(500, this.onGlowToogle);
    },
    
    onGlowToogleStop : function(){
    	this.stopTimer();
    	if(this.glowObj){
    		this.glowObj.remove();
    		this.glowObj = null;
    	}
    },
    
    setLabel : function(labelStr){
    	this.label = labelStr;
    	var children = this.getChildren();
		if(children.getSize()>0){
			if(children.get(0) instanceof graphiti.shape.basic.Label){
				children.get(0).setText(labelStr);
			}
		}else{
			var label = new graphiti.shape.basic.Label(labelStr);
			label.setFontColor("#0000ff");
	      	label.setStroke(0);
	      	if(this.canvas!=null){
	      		label.setVisible(this.canvas.labelView);	
	      	}
	        this.addFigure(label, new graphiti.layout.locator.BottomLocator(this));
		}
		this.relocate();
    },
    
    getLabel : function(){
    	return this.label;
    },
    
    relocate : function(){
    	for(var i=0; i<this.children.getSize();i++) {
            var entry = this.children.get(i);
            entry.locator.relocate(i, entry.figure);
        }
    }
});


