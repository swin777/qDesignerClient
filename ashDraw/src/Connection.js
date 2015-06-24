dojo.declare("ashDraw.Connection", ashDraw.shape.basic.PolyLine, {
    NAME : "ashDraw.Connection",

//    DEFAULT_ROUTER: new ashDraw.layout.connection.DirectRouter(),
//    DEFAULT_ROUTER: new ashDraw.layout.connection.ManhattanConnectionRouter(),
//    DEFAULT_ROUTER: new ashDraw.layout.connection.ManhattanBridgedConnectionRouter(),
//    DEFAULT_ROUTER: new ashDraw.layout.connection.BezierConnectionRouter(),
    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function(type) {
      this.inherited(arguments);
      this.sourcePort = null;
      this.targetPort = null;
    
      this.oldPoint=null;
      
      this.sourceDecorator = null; /*:ashDraw.ConnectionDecorator*/
      this.targetDecorator = null; /*:ashDraw.ConnectionDecorator*/
      this.connectType = "Direct";
      
      // decoration of the polyline
      //
      this.sourceDecoratorNode = null;
      this.targetDecoratorNode=null;
  
  	  if(typeof DEFAULT_ROUTER == "undefined"){
  	  	DEFAULT_ROUTER = new ashDraw.layout.connection.DirectRouter();
  	  }
  	  
  	  if(typeof DEFAULT_ROUTER != "undefined" && type=="DirectRouter"){
  	  	DEFAULT_ROUTER = new ashDraw.layout.connection.DirectRouter();
  	  	this.connectType = "Direct";
  	  }else  if(typeof DEFAULT_ROUTER != "undefined" && type=="ManhattanBridgedConnectionRouter"){
  	  	DEFAULT_ROUTER = new ashDraw.layout.connection.ManhattanBridgedConnectionRouter();
  	  	this.connectType = "Manhattan";
  	  }else  if(typeof DEFAULT_ROUTER != "undefined" && type=="BezierConnectionRouter"){
  	  	DEFAULT_ROUTER = new ashDraw.layout.connection.BezierConnectionRouter();
  	  	this.connectType = "Bezier";
  	  }
  	  
      this.router = DEFAULT_ROUTER;

      //this.setColor("#4cbf2f");
      this.setColor("#33801A");
      this.setStroke(2);
    },
    
    disconnect : function(){
        if (this.sourcePort !== null) {
            this.sourcePort.detachMoveListener(this);
            this.fireSourcePortRouteEvent();
        }

        if (this.targetPort !== null) {
            this.targetPort.detachMoveListener(this);
            this.fireTargetPortRouteEvent();
        }
    },
    
    
    reconnect : function(){
        if (this.sourcePort !== null) {
            this.sourcePort.attachMoveListener(this);
            this.fireSourcePortRouteEvent();
        }

        if (this.targetPort !== null) {
            this.targetPort.attachMoveListener(this);
            this.fireTargetPortRouteEvent();
        }
        this.routingRequired =true;
        this.repaint();
    },
    
    isResizeable : function(){
        return this.isDraggable();
    },
    
    addFigure : function(child, locator){
        // just to ensure the right interface for the locator.
        // The base class needs only 'ashDraw.layout.locator.Locator'.
        if(!(locator instanceof ashDraw.layout.locator.ConnectionLocator)){
           //throw "Locator must implement the class ashDraw.layout.locator.ConnectionLocator"; 
           return;
        }
        
        this.inherited(arguments, [child, locator])
    },
    
    setSourceDecorator:function( decorator){
      this.sourceDecorator = decorator;
      this.routingRequired = true;
      if(this.sourceDecoratorNode!==null){
          this.sourceDecoratorNode.remove();
          this.sourceDecoratorNode=null;
      }
      this.repaint();
    },
    
    getSourceDecorator:function(){
      return this.sourceDecorator;
    },
    
    setTargetDecorator:function( decorator){
      decorator.setColor(this.lineColor);
      this.targetDecorator = decorator;
      this.routingRequired =true;
      if(this.targetDecoratorNode!==null){
          this.targetDecoratorNode.remove();
          this.targetDecoratorNode=null;
      }      
      this.repaint();
    },
    
    getTargetDecorator:function(){
      return this.targetDecorator;
    },
    
    setRouter:function(router){
      if(typeof router ==="undefined" || router===null){
    	  this.router = new ashDraw.layout.connection.NullRouter();
      }
      else{
    	  this.router = router;
      }
      this.routingRequired =true;
    
      // repaint the connection with the new router
      this.repaint();
    },
    
    getRouter:function(){
      return this.router;
    },
    
    calculatePath: function(){
        
        if(this.sourcePort===null || this.targetPort===null){
            return;
        }
        
        this.inherited(arguments)
    },
    
    repaint:function(attributes){
      if(this.repaintBlocked===true || this.shape===null){
          return;
      }
      
      if(this.sourcePort===null || this.targetPort===null){
          return;
      }

      this.inherited(arguments, [attributes]);

	    // paint the decorator if any exists
	    //
	    if(this.getSource().getParent().isMoving===false && this.getTarget().getParent().isMoving===false )
	    {
	      if(this.targetDecorator!==null && this.targetDecoratorNode===null){
	      	this.targetDecoratorNode= this.targetDecorator.paint(this.getCanvas().paper);
	      }
	
	      if(this.sourceDecorator!==null && this.sourceDecoratorNode===null){
	      	this.sourceDecoratorNode= this.sourceDecorator.paint(this.getCanvas().paper);
	      }
	    }
	    
	    // translate/transform the decorations to the end/start of the connection 
	    // and rotate them as well
	    //
	    if(this.sourceDecoratorNode!==null){
	  	  this.sourceDecoratorNode.transform("r"+this.getStartAngle()+"," + this.getStartX() + "," + this.getStartY()+" t" + this.getStartX() + "," + this.getStartY());
	    }
        if(this.targetDecoratorNode!==null){
            this.targetDecoratorNode.transform("r"+this.getEndAngle()+"," + this.getEndX() + "," + this.getEndY()+" t" + this.getEndX() + "," + this.getEndY());
        }

    },
    

    postProcess: function(postPorcessCache){
    	this.router.postProcess(this, this.getCanvas(), postPorcessCache);
    },
    
    onDragEnter : function( draggedFigure ){
    	this.setGlow(true);
    	
    	return this;
    },
 
    onDragLeave:function( draggedFigure ){
    	this.setGlow(false);
    },


    getStartPoint:function(){
      if(this.isMoving===false){
         return this.sourcePort.getConnectionAnchorLocation(this.targetPort.getConnectionAnchorReferencePoint());
      }
      else{
         return this.inherited(arguments)
      }
    },
    
    
   
     getEndPoint:function()
     {
      if(this.isMoving===false){
         return this.targetPort.getConnectionAnchorLocation(this.sourcePort.getConnectionAnchorReferencePoint());
      }
      else{
         return this.inherited(arguments);
      }
     },
    
    
    setSource:function( port)
    {
      if(this.sourcePort!==null){
        this.sourcePort.detachMoveListener(this);
      }
    
      this.sourcePort = port;
      if(this.sourcePort===null){
        return;
      }
      this.routingRequired = true;
      this.fireSourcePortRouteEvent();
      this.sourcePort.attachMoveListener(this);
      this.setStartPoint(port.getAbsoluteX(), port.getAbsoluteY());
    },
    
    
    getSource:function()
    {
      return this.sourcePort;
    },
    
    
    setTarget:function( port)
    {
      if(this.targetPort!==null){
        this.targetPort.detachMoveListener(this);
      }
    
      this.targetPort = port;
      if(this.targetPort===null){
        return;
      }
      
      this.routingRequired = true;
      this.fireTargetPortRouteEvent();
      this.targetPort.attachMoveListener(this);
      this.setEndPoint(port.getAbsoluteX(), port.getAbsoluteY());
    },
    
   
    getTarget:function()
    {
      return this.targetPort;
    },
    
   
    setCanvas: function( canvas )
    {
    	this.inherited(arguments, [canvas]);
       
       if(this.sourceDecoratorNode!==null){
           this.sourceDecoratorNode.remove();
           this.sourceDecoratorNode=null;
       }
       
       if(this.targetDecoratorNode!==null){
           this.targetDecoratorNode.remove();
           this.targetDecoratorNode=null;
       }
    },

   
    onOtherFigureIsMoving:function(/*:ashDraw.Figure*/ figure)
    {
      if(figure===this.sourcePort){
        this.setStartPoint(this.sourcePort.getAbsoluteX(), this.sourcePort.getAbsoluteY());
      }
      else{
        this.setEndPoint(this.targetPort.getAbsoluteX(), this.targetPort.getAbsoluteY());
      }
      this.inherited(arguments, [figure]);
    },
    
    getStartAngle:function()
    {
    	// return a good default value if the connection is not routed at the 
    	//  moment
    	if( this.lineSegments.getSize()===0){
    		return 0;
    	}
    	
      var p1 = this.lineSegments.get(0).start;
      var p2 = this.lineSegments.get(0).end;
      // if(this.router instanceof ashDraw.layout.connection.BezierConnectionRouter)
      // {
       // p2 = this.lineSegments.get(5).end;
      // }
      var length = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
      var angle = -(180/Math.PI) *Math.asin((p1.y-p2.y)/length);
    
      if(angle<0)
      {
         if(p2.x<p1.x){
           angle = Math.abs(angle) + 180;
         }
         else{
           angle = 360- Math.abs(angle);
         }
      }
      else
      {
         if(p2.x<p1.x){
           angle = 180-angle;
         }
      }
      return angle;
    },
    
    getEndAngle:function()
    {
      // return a good default value if the connection is not routed at the 
      //  moment
      if (this.lineSegments.getSize() === 0) {
        return 90;
      }
    
      var p1 = this.lineSegments.get(this.lineSegments.getSize()-1).end;
      var p2 = this.lineSegments.get(this.lineSegments.getSize()-1).start;
      // if(this.router instanceof ashDraw.layout.connection.BezierConnectionRouter)
      // {
       // p2 = this.lineSegments.get(this.lineSegments.getSize()-5).end;
      // }
      var length = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
      var angle = -(180/Math.PI) *Math.asin((p1.y-p2.y)/length);
    
      if(angle<0)
      {
         if(p2.x<p1.x){
           angle = Math.abs(angle) + 180;
         }
         else{
           angle = 360- Math.abs(angle);
         }
      }
      else
      {
         if(p2.x<p1.x){
           angle = 180-angle;
         }
      }
      return angle;
    },
    
    fireSourcePortRouteEvent:function()
    {
        // enforce a repaint of all connections which are related to this port
        // this is required for a "FanConnectionRouter" or "ShortesPathConnectionRouter"
        //
       var connections = this.sourcePort.getConnections();
       for(var i=0; i<connections.getSize();i++)
       {
          connections.get(i).repaint();
       }
    },
   
    fireTargetPortRouteEvent:function()
    {
        // enforce a repaint of all connections which are related to this port
        // this is required for a "FanConnectionRouter" or "ShortesPathConnectionRouter"
        //
       var connections = this.targetPort.getConnections();
       for(var i=0; i<connections.getSize();i++)
       {
          connections.get(i).repaint();
       }
    },
    
    createCommand:function( request)
    {
      if(request.getPolicy() === ashDraw.command.CommandType.MOVE_BASEPOINT)
      {
        // DragDrop of a connection doesn't create a undo command at this point. This will be done in
        // the onDrop method
        return new ashDraw.command.CommandReconnect(this);
      }

      return this.inherited(arguments);
    },
    
    getPersistentAttributes : function()
    {
        var memento = this.inherited(arguments);
        delete memento.x;
        delete memento.y;
        delete memento.width;
        delete memento.height;

        memento.source = {
                  node:this.getSource().getParent().getId(),
                  port: this.getSource().getName()
                };
        
        memento.target = {
                  node:this.getTarget().getParent().getId(),
                  port:this.getTarget().getName()
                };
        memento.connectType = this.connectType;
        return memento;
    },
    
    setPersistentAttributes : function(memento)
    {
    	  this.connectType = memento.connectType;
    	  this.inherited(arguments, [memento])
        
          if(typeof DEFAULT_ROUTER == "undefined"){
	  	  	this.router = new ashDraw.layout.connection.DirectRouter();
	  	  }
	  	  
	  	  if(typeof this.connectType != "undefined" && this.connectType=="Direct"){
	  	  	this.router = new ashDraw.layout.connection.DirectRouter();
	  	  }else  if(typeof this.connectType != "undefined" && this.connectType=="Manhattan"){
	  	  	this.router = new ashDraw.layout.connection.ManhattanBridgedConnectionRouter();
	  	  }else  if(typeof this.connectType != "undefined" && this.connectType=="Bezier"){
	  	  	this.router = new ashDraw.layout.connection.BezierConnectionRouter();
	  	  }
        // no extra param to read.
        // Reason: done by the Layoute/Router
    }
});

ashDraw.Connection.createConnection=function(sourcePort, targetPort){
    return new ashDraw.Connection();
};