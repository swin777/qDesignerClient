



/**
 * @class hatio.VolatilePort
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var figure =  new hatio.VolatilePort();
 *     canvas.addFigure(figure,10,10);
 *     
 *     
 * @extends graphiti.SVGFigure
 */
// declare the namespace for this example
hatio.VolatilePort = graphiti.Port.extend({

    NAME:"hatio.VolatilePort",

	/**
     * @constructor
     * Create a new HybridPort element
     * 
     * @param {String} [name] the name for the Port.
     */
    init : function(name)
    {
        this._super(name);
        
        if (graphiti.isTouchDevice) {
            this.setDimension(25, 25);
        }
        else {
            this.setDimension(18, 18);
        }
		this.canvas;
		this.figure;
        // responsive for the arrangement of the port 
        // calculates the x/y coordinates in relation to the parent node
        this.locator=new graphiti.layout.locator.InputPortLocator();
    },

    
    /**
     * @inheritdoc
     * 
     * @param {graphiti.Figure} figure The figure which is currently dragging
     * @return {graphiti.Figure} the figure which should receive the drop event or null if the element didnt want a drop event
     */
    onDragEnter : function(figure)
    {
    	// Accept any kind of port
        if (figure instanceof graphiti.Port) {
            return this._super(figure);
        }
        
        return null;
    },
    
    /**
     * @inheritdoc
     * 
     */
    onDragLeave:function( figure)
    {
	  // Ports accepts only Ports as DropTarget
	  //
	  if(!(figure instanceof graphiti.Port)){
		 return;
	  }

	  // accept any kind of port
      if(figure instanceof graphiti.Port){
        this._super( figure);
      }
      
    },

    /**
     * @inheritdoc
     *
     * @param {graphiti.command.CommandType} request describes the Command being requested
     * @return {graphiti.command.Command} null or a valid command
     **/
    createCommand:function(request)
    {
       // Connect request between two ports
       //
       if(request.getPolicy() === graphiti.command.CommandType.CONNECT) {
           
         if(request.source.getParent().getId() === request.target.getParent().getId()){
            return null;
         }    

         if (request.source instanceof graphiti.InputPort) {
            // This is the difference to the InputPort implementation of createCommand.
            return new graphiti.command.CommandConnect(request.canvas, request.target, request.source);
         }
         else if (request.source instanceof graphiti.OutputPort) {
            // This is the different to the OutputPort implementation of createCommand
            return new graphiti.command.CommandConnect(request.canvas, request.source, request.target);
         }
         else if (request.source instanceof graphiti.HybridPort) {
            // This is the different to the OutputPort implementation of createCommand
            return new graphiti.command.CommandConnect(request.canvas, request.source, request.target);
         }
         
         return null;
       }
    
       // ...else call the base class
       return this._super(request);
    },
    
    show:function(canvas, x, y, figure)
    {
      this.canvas = canvas;
      this.figure = figure;
      // don't call the parent function. The parent functions delete this object
      // and a resize handle can't be deleted.
      if(this.shape===null) {
         this.setCanvas(canvas);
      }
     
      this.setPosition(x,y);
      this.shape.toFront();
    },
    
    /**
     * @method
     * Hide the resize handle and remove it from the cnavas.
     *
     **/
    hide:function()
    {
      // don't call the parent function. The parent functions delete this object
      // and a resize handle shouldn't be deleted.
      if(this.shape===null){
        return;
      }
        
      this.setCanvas(null);
    },
    
    onDragStart : function()
    {
        this.originalSnapToGrid = this.canvas.getSnapToGrid();
        this.originalSnapToGeometry = this.canvas.getSnapToGeometry();
        this.canvas.setSnapToGrid(false);
        this.canvas.setSnapToGeometry(false);

        this.getShapeElement().toFront();
        // dont't call the super method. This creates a command and this is not necessary for a port
        this.ox = this.x;
        this.oy = this.y;

       return true;
    },
    
    onDrag:function(dx, dy)
    {
      this.isInDragDrop = true;

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
      
      this.canvas.showConnectionLine(this.ox, this.oy, 
                                                 this.getAbsoluteX(), this.getAbsoluteY());

      var target=this.getDropTarget(this.getAbsoluteX(),this.getAbsoluteY(), this);
      // the hovering element has been changed
      if(target!==this.currentTarget){
          if(this.currentTarget!==null){
              this.currentTarget.onDragLeave(this);
          }
          if(target!==null){
              this.currentTarget= target.onDragEnter(this);
          }
      }
    },
    
    onDragEnd:function()
    {
      this.canvas.setSnapToGrid(this.originalSnapToGrid );
      this.canvas.setSnapToGeometry( this.originalSnapToGeometry );
      
      // Don't call the parent implementation. This will create an CommandMove object
      // and store them o the CommandStack for the undo operation. This makes no sense for a
      // port.
      // graphiti.shape.basic.Rectangle.prototype.onDragEnd.call(this); DON'T call the super implementation!!!
    
      this.setAlpha(1.0);
    
      // 1.) Restore the old Position of the node
      //
      
      var dropObj = this.canvas.getBestFigure(this.x, this.y, this);
      if(dropObj===null || dropObj instanceof hatio.shape.node.basic.Group){ //빈곳에 drop한 경우에만 노드를 생성한다.
      	var newFigrue = this.canvas.addFigrueTypeCommand(this.figure.NAME, this.x, this.y, this.figure);
      	var figruePortArr = this.figure.getPorts();
      	var newfigruePortArr = newFigrue.getPorts();
      	var selectPortInfo = null;
      	for(var i=0; i<figruePortArr.getSize(); i++){
      		for(var k=0; k<newfigruePortArr.getSize(); k++){
      			var currPortInfo = new Object();
      			currPortInfo.startPort = figruePortArr.get(i);
      			currPortInfo.endPort = newfigruePortArr.get(k);
      			this.pointToPointDistance(currPortInfo);
      			if(selectPortInfo===null){
      				selectPortInfo = currPortInfo;
      			}else{
      				if(currPortInfo.distance < selectPortInfo.distance){
      					selectPortInfo = currPortInfo;
      				}
      			}
      		}
      	}
      	
      	var conn = new graphiti.Connection(this.canvas.connectType);
      	//conn.setSourceDecorator(new graphiti.decoration.connection.BarDecorator());
		conn.setTargetDecorator(new graphiti.decoration.connection.ArrowDecorator());
   	 	conn.setSource(selectPortInfo.startPort);
   	 	conn.setTarget(selectPortInfo.endPort);
   	 	this.canvas.addFigrueCommand(conn);
      }
      
      this.setPosition(this.ox,this.oy);
    
      // 2.) Remove the bounding line from the canvas
      //
      this.canvas.hideConnectionLine();
      //this.canvas.hideResizeHandles();
      this.canvas.setCurrentSelection(null);
      //this.isInDragDrop =false;
      
      // Reset the drag&drop flyover information 
      //
      //this.currentTarget = null;
      //this.canvas.mouseActClear();
    },
    
    pointToPointDistance : function(selectPortInfo){
    	var point1 = new Object();
    	var point2 = new Object();
    	point1.x = selectPortInfo.startPort.x + selectPortInfo.startPort.getAbsoluteX();
    	point1.y = selectPortInfo.startPort.y + selectPortInfo.startPort.getAbsoluteY();
    	point2.x = selectPortInfo.endPort.x + selectPortInfo.endPort.getAbsoluteX();
    	point2.y = selectPortInfo.endPort.y + selectPortInfo.endPort.getAbsoluteY();
    	selectPortInfo.distance = Math.sqrt(Math.pow(Math.abs(point1.x-point2.x),2) + Math.pow(Math.abs(point1.y-point2.y),2))
    },
    
    getDropTarget: function (x , y, portToIgnore)
    {
      // for(var i=0;i<this.targets.getSize();i++)
      // {
        // var target = this.targets.get(i);
        // if (target!==portToIgnore)
        // {
	        // if (target.hitTest(x, y)===true)
	        // {
	            // return target;
	        // }
        // }
      // }
      
      return null;
    }
});