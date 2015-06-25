define(["dojo/_base/declare",
        "ashDraw/layout/locator/InputPortLocator",
        "ashDraw/Port",
        "ashDraw/command/CommandType",
        "ashDraw/InputPort",
        "ashDraw/OutputPort",
        "ashDraw/HybridPort",
        "ashDraw/command/CommandConnect",
        "ashDraw/policy/EditPolicy",
        "ashDraw/geo/Point",
        "ashDraw/Connection",
        "ashDraw/decoration/connection/ArrowDecorator",
        "ashDrawEx/shape/node/basic/Group"], function(declare){
	return declare("ashDrawEx.VolatilePort", ashDraw.Port, {
	    NAME:"ashDrawEx.VolatilePort",

	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor : function(name)
	    {
	    	this.inherited(arguments, [name]);
	        if (ashDraw.isTouchDevice) {
	            this.setDimension(25, 25);
	        }
	        else {
	            this.setDimension(18, 18);
	        }
			this.canvas;
			this.figure;
	        this.locator=new ashDraw.layout.locator.InputPortLocator();
	    },

	    onDragEnter : function(figure)
	    {
	        if (figure instanceof ashDraw.Port) {
	            return this.inherited(arguments, [figure]);
	        }
	        
	        return null;
	    },
	   
	    onDragLeave:function( figure)
	    {
		  if(!(figure instanceof ashDraw.Port)){
			 return;
		  }

	      if(figure instanceof ashDraw.Port){
	        this.inherited( arguments, [figure]);
	      }
	      
	    },

	    createCommand:function(request)
	    {
	       if(request.getPolicy() === ashDraw.command.CommandType.CONNECT) {
	           
	         if(request.source.getParent().getId() === request.target.getParent().getId()){
	            return null;
	         }    

	         if (request.source instanceof ashDraw.InputPort) {
	            return new ashDraw.command.CommandConnect(request.canvas, request.target, request.source);
	         }
	         else if (request.source instanceof ashDraw.OutputPort) {
	            return new ashDraw.command.CommandConnect(request.canvas, request.source, request.target);
	         }
	         else if (request.source instanceof ashDraw.HybridPort) {
	            return new ashDraw.command.CommandConnect(request.canvas, request.source, request.target);
	         }
	         
	         return null;
	       }
	       return this.inherited(arguments, [request]);
	    },
	    
	    show:function(canvas, x, y, figure)
	    {
	      this.canvas = canvas;
	      this.figure = figure;
	      if(this.shape===null) {
	         this.setCanvas(canvas);
	      }
	     
	      this.setPosition(x,y);
	      this.shape.toFront();
	    },
	    
	    hide:function()
	    {
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
	        this.ox = this.x;
	        this.oy = this.y;

	       return true;
	    },
	    
	    onDrag:function(dx, dy)
	    {
	      this.isInDragDrop = true;

	     this.editPolicy.each($.proxy(function(i,e){
	            if(e.getRole()===ashDraw.policy.EditPolicy.Role.PRIMARY_DRAG_ROLE){
	                var newPos = e.apply(this,this.ox+dx,this.oy+dy);
	                dx = newPos.x-this.ox;
	                dy = newPos.y-this.oy;
	            }
	      },this));
	        
	      this.x = this.ox+dx;
	      this.y = this.oy+dy;

	      if(this.getCanSnapToHelper())
	      {
	        var p = new ashDraw.geo.Point(this.x,this.y);
	        p = this.getCanvas().snapToHelper(this, p);
	        this.x = p.x;
	        this.y = p.y;
	      }

	      this.setPosition(this.x, this.y);
	      
	      if(this.isMoving===false)
	      {
	       this.isMoving = true;
	       this.setAlpha(this.originalAlpha*0.7);
	      }
	      
	      this.canvas.showConnectionLine(this.ox, this.oy, 
	                                                 this.getAbsoluteX(), this.getAbsoluteY());

	      var target=this.getDropTarget(this.getAbsoluteX(),this.getAbsoluteY(), this);
	   
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
	     
	      this.setAlpha(1.0);
	    
	      var dropObj = this.canvas.getBestFigure(this.x, this.y, this);
	      if(dropObj===null || dropObj instanceof ashDrawEx.shape.node.basic.Group){ //빈곳에 drop한 경우에만 노드를 생성한다.
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
	      	
	      	var conn = new ashDraw.Connection(this.canvas.connectType);
	      	//conn.setSourceDecorator(new ashDraw.decoration.connection.BarDecorator());
			conn.setTargetDecorator(new ashDraw.decoration.connection.ArrowDecorator());
	   	 	conn.setSource(selectPortInfo.startPort);
	   	 	conn.setTarget(selectPortInfo.endPort);
	   	 	this.canvas.addFigrueCommand(conn);
	      }
	      
	      this.setPosition(this.ox,this.oy);
	    
	      this.canvas.hideConnectionLine();
	      
	      this.canvas.setCurrentSelection(null);
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
});