define(["dojo/_base/declare",
        "ashDraw/util/ArrayList",
        "ashDraw/Figure",
        "ashDraw/shape/node/Node",
        "ashDraw/geo/Point",
        "ashDraw/geo/Rectangle",
        "ashDraw/shape/basic/Line",
        "ashDraw/Connection",
        "ashDraw/ResizeHandle",
        "ashDraw/Port",
        "ashDraw/shape/basic/LineStartResizeHandle",
        "ashDraw/shape/basic/LineEndResizeHandle",
        "ashDraw/command/CommandType",
        "ashDraw/command/CommandStack",
        "ashDraw/io/json/Reader",
        "ashDraw/io/json/Writer",
        "ashDraw/io/png/Writer",
        "ashDraw/io/svg/Writer",
        "ashDraw/io/Reader",
        "ashDraw/io/Writer",], function(declare){
	return declare("ashDraw.Canvas", null, {
	    NAME : "ashDraw.Canvas",
	    
	    constructor : function(canvasId){
	        this.setScrollArea(document.body);
	        this.canvasId = canvasId;
	        this.html = $("#"+canvasId);
	        this.initialWidth = this.getWidth();
	        this.initialHeight = this.getHeight();
	        
	        this.html.css({"-webkit-tap-highlight-color": "rgba(0,0,0,0)"});
	        this.html.droppable({
	            accept: '.ashDraw_droppable',
	            over: $.proxy(function(event, ui) {
	                this.onDragEnter(ui.draggable);
	            },this),
	            out: $.proxy(function(event, ui) {
	                this.onDragLeave(ui.draggable);
	            },this),
	            drop:$.proxy(function(event, ui){
	                event = this._getEvent(event);
	                var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
	                this.onDrop(ui.draggable, pos.getX(), pos.getY());
	            },this)
	        });
	        
	        
	        $(".ashDraw_droppable").draggable({
	            appendTo:"body",
	            stack:"body",
	            zIndex: 27000,
	            helper:"clone",
	            drag: $.proxy(function(event, ui){
	                event = this._getEvent(event);
	                var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
	                this.onDrag(ui.draggable, pos.getX(), pos.getY());
	            },this),
	            stop: function(e, ui){
	                this.isInExternalDragOperation=false;
	            },
	            start: function(e, ui){
	                this.isInExternalDragOperation=true;
	                $(ui.helper).addClass("shadow");
	            }
	       });

	        
	        this.paper = Raphael(canvasId, this.getWidth(), this.getHeight());
	        this.paper.canvas.style.position="absolute";
	        
	        this.zoomFactor = 1.0; // range [0.001..10]
	        
	        this.currentSelection  = null;
	        this.currentDropTarget = null;
	        this.isInExternalDragOperation=false;
	                
	        this.connectionLine    = new ashDraw.shape.basic.Line();
	      
	        this.resizeHandle1 = new ashDraw.ResizeHandle(this,1); // 1 = LEFT TOP
	        this.resizeHandle2 = new ashDraw.ResizeHandle(this,2); // 2 = CENTER_TOP
	        this.resizeHandle3 = new ashDraw.ResizeHandle(this,3); // 3 = RIGHT_TOP
	        this.resizeHandle4 = new ashDraw.ResizeHandle(this,4); // 4 = RIGHT_MIDDLE
	        this.resizeHandle5 = new ashDraw.ResizeHandle(this,5); // 5 = RIGHT_BOTTOM
	        this.resizeHandle6 = new ashDraw.ResizeHandle(this,6); // 6 = CENTER_BOTTOM
	        this.resizeHandle7 = new ashDraw.ResizeHandle(this,7); // 7 = LEFT_BOTTOM
	        this.resizeHandle8 = new ashDraw.ResizeHandle(this,8); // 8 = LEFT_MIDDLE

	        this.resizeHandleStart = new ashDraw.shape.basic.LineStartResizeHandle(this);
	        this.resizeHandleEnd   = new ashDraw.shape.basic.LineEndResizeHandle(this);
	        
	        this.resizeHandles = new ashDraw.util.ArrayList();
	        this.resizeHandles.add(this.resizeHandle1);
	        this.resizeHandles.add(this.resizeHandle2);
	        this.resizeHandles.add(this.resizeHandle3);
	        this.resizeHandles.add(this.resizeHandle4);
	        this.resizeHandles.add(this.resizeHandle5);
	        this.resizeHandles.add(this.resizeHandle6);
	        this.resizeHandles.add(this.resizeHandle7);
	        this.resizeHandles.add(this.resizeHandle8);
	        this.resizeHandles.add(this.resizeHandleStart);
	        this.resizeHandles.add(this.resizeHandleEnd);

	        this.resizeHandleHalfWidth = this.resizeHandle2.getWidth()/2;
	       
	        // SnapTo status var's
	        //
	        this.snapToGridHelper = null;
	        this.snapToGeometryHelper = null;

	        this.verticalSnapToHelperLine = null;
	        this.horizontalSnapToHelperLine = null;

	        // internal document with all figures, ports, ....
	        //
	        this.figures     = new ashDraw.util.ArrayList();
	        this.lines       = new ashDraw.util.ArrayList();
	        this.commonPorts = new ashDraw.util.ArrayList();
	        this.dropTargets = new ashDraw.util.ArrayList();
	       
	        // listener for selection handling
	        this.selectionListeners = new ashDraw.util.ArrayList();

	        // The CommandStack for undo/redo ooperations
	        this.commandStack = new ashDraw.command.CommandStack();
	       
	        
	        // INTERSECTION/CROSSING handling for connections and lines
	        //
	        this.linesToRepaintAfterDragDrop =  new ashDraw.util.ArrayList();
	        this.lineIntersections = new ashDraw.util.ArrayList();
	        
	        // Calculate all intersection between the different lines
	        //
	        this.commandStack.addEventListener($.proxy(function(event){
	            if(event.isPostChangeEvent()===true){
	                this.lineIntersections = new ashDraw.util.ArrayList();
	                var lines = this.getLines().clone();
	                while(lines.getSize()>0){
	                    var l1 = lines.removeElementAt(0);
	                    lines.each($.proxy(function(ii,l2){
	                        var partInter =l1.intersection(l2);
	                        if(partInter.getSize()>0){
	                           this.lineIntersections.add({line:l1, other:l2, intersection:partInter});
	                           this.lineIntersections.add({line:l2, other:l1, intersection:partInter});
	                        }
	                    },this));
	                }
	                this.linesToRepaintAfterDragDrop.each(function(i,line){
	                    line.svgPathString=null;
	                    line.repaint();
	                });
	                this.linesToRepaintAfterDragDrop =  new ashDraw.util.ArrayList();
	            }
	        },this));
	        
	        // DragDrop handling
	        //
	        this.mouseDown  = false;
	        this.mouseDownX = 0;
	        this.mouseDownY = 0;
	        this.mouseDraggingElement = null;
	        this.mouseDownElement = null;
	        
	        this.html.bind("mouseup touchend", $.proxy(function(event)
	        {
	            if (this.mouseDown === false){
	                return;
	            }

	            event = this._getEvent(event);

	            this.mouseDown = false;
	            this.onMouseUp();
	        }, this));

	        this.html.bind("mousemove touchmove", $.proxy(function(event)
	        {
	            event = this._getEvent(event);
	            if (this.mouseDown === false){
	               var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
	               this.onMouseMove(pos.x, pos.y);
	            }
	            else{
	               var diffX = (event.clientX - this.mouseDownX)*this.zoomFactor;
	               var diffY = (event.clientY - this.mouseDownY)*this.zoomFactor;
	               this.onMouseDrag(diffX, diffY);
	           }
	        }, this));
	        
	        this.html.bind("mousedown touchstart", $.proxy(function(event)
	        {
	            switch (event.which) {
	            case 1: //Left mouse button pressed
	                event.preventDefault();
	                event = this._getEvent(event);

	                this.mouseDownX = event.clientX;
	                this.mouseDownY = event.clientY;
	                var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
	                this.mouseDown = true;
	                this.onMouseDown(pos.x, pos.y);
	                break;
	            case 3: //Right mouse button pressed             
	                event.preventDefault();
	                event = this._getEvent(event);
	                var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
	                this.onRightMouseDown(pos.x, pos.y);
	                break;
	            case 2:
	                //Middle mouse button pressed
	             default:
	                //You have a strange mouse
	            }
	        }, this));
	        
	        
	        // Catch the dblclick and route them to the Canvas hook.
	        //
	        $(document).bind("dblclick",$.proxy(function(event)
	        {
	            event = this._getEvent(event);

	            this.mouseDownX = event.clientX;
	            this.mouseDownY = event.clientY;
	            var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
	            this.onDoubleClick(pos.x, pos.y);
	        },this));

	        
	        // Catch the keyDown and CTRL-key and route them to the Canvas hook.
	        //
	        $(document).bind("click",$.proxy(function(event)
	        {
	            event = this._getEvent(event);

	            // fire only the click event if we didn't move the mouse (drag&drop)
	            //
	            if(this.mouseDownX === event.clientX ||  this.mouseDownY === event.clientY){
	                var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
	                this.onClick(pos.x, pos.y);
	            }
	        },this));

	        // Catch the keyDown and CTRL-key and route them to the Canvas hook.
	        //
	        $(document).bind("keydown",$.proxy(function(event)
	        {
	          // don't initiate the delete command if the event comes from an INPUT field. In this case the user want delete
	          // a character in the input field and not the related shape
	          if(!$(event.target).is("input")){
	             var ctrl = event.ctrlKey;
	             this.onKeyDown(event.keyCode, ctrl);
	           }
	        },this));

	    },
	    
	    clear : function(){
	        
	        this.lines.clone().each($.proxy(function(i,e){
	            this.removeFigure(e);
	        },this));
	        
	         this.figures.clone().each($.proxy(function(i,e){
	            this.removeFigure(e);
	        },this));
	        
	        this.zoomFactor =1.0;
	        this.currentSelection  = null;
	        this.currentDropTarget = null;
	        this.isInExternalDragOperation=false;
	        // SnapTo status var's
	        //
	        this.snapToGridHelper = null;
	        this.snapToGeometryHelper = null;

	        this.verticalSnapToHelperLine = null;
	        this.horizontalSnapToHelperLine = null;

	        // internal document with all figures, ports, ....
	        //
	        this.figures = new ashDraw.util.ArrayList();
	        this.lines = new ashDraw.util.ArrayList();
	        this.commonPorts = new ashDraw.util.ArrayList();
	        this.dropTargets = new ashDraw.util.ArrayList();
	       
	        // listener for selection handling
	        this.selectionListeners = new ashDraw.util.ArrayList();

	        // The CommandStack for undo/redo ooperations
	        this.commandStack = new ashDraw.command.CommandStack();
	       
	        
	        // INTERSECTION/CROSSING handling for connections and lines
	        //
	        
	        this.linesToRepaintAfterDragDrop =  new ashDraw.util.ArrayList();
	        
	        this.lineIntersections = new ashDraw.util.ArrayList();
	        this.mouseDraggingElement = null;
	        this.mouseDownElement = null;
	    },
	    
	    setZoom : function(zoomFactor){
	       this.zoomFactor = Math.min(Math.max(0.01,zoomFactor),10);
	        
	        var viewBoxWidth  = parseInt(this.initialWidth*this.zoomFactor,10);
	        var viewBoxHeight = parseInt(this.initialHeight*this.zoomFactor,10);
	        
	// BUG: raphael didn't handle setViewBox AND setSize correct
//	        this.paper.setSize(this.html.width(), this.html.height());
	        this.paper.setViewBox(0, 0, viewBoxWidth, viewBoxHeight);
	        
	        this.html.width(this.initialWidth / this.zoomFactor);
	        this.html.height(this.initialHeight / this.zoomFactor);
	    },

	    getZoom: function(){
	        return this.zoomFactor;
	    },
	    
	    fromDocumentToCanvasCoordinate : function(x,y) {
	        return new ashDraw.geo.Point(
	                (x - this.getAbsoluteX() + this.getScrollLeft())*this.zoomFactor,
	                (y - this.getAbsoluteY() + this.getScrollTop())*this.zoomFactor);
	    },
	    
	    fromCanvasToDocumentCoordinate : function(x,y) {
	        return new ashDraw.geo.Point(
	                (x + this.getAbsoluteX() - this.getScrollLeft())*this.zoomFactor,
	                (y + this.getAbsoluteY() - this.getScrollTop())*this.zoomFactor);
	    },
	    
	    getHtmlContainer: function(){
	       return this.html; 
	    },
	    
	    _getEvent:function(event){
	      if(event.originalEvent.touches && event.originalEvent.touches.length) {
	           return event.originalEvent.touches[0];
	      } else if(event.originalEvent.changedTouches && event.originalEvent.changedTouches.length) {
	           return event.originalEvent.changedTouches[0];
	      }
	      return event;
	    },

	    setScrollArea:function(elementSelector){
	       this.scrollArea= $(elementSelector);
	    },

	    getScrollArea:function(){
	       return this.scrollArea;
	    },
	    
	    getScrollLeft:function(){
	      return this.scrollArea.scrollLeft();
	    },

	    getScrollTop:function(){
	      return this.scrollArea.scrollTop();
	    },

	    getAbsoluteX:function(){
	        return this.html.offset().left;
	    },

	    getAbsoluteY:function(){
	      return this.html.offset().top;
	    },

	    getWidth : function(){
	        return this.html.width();
	    },

	    getHeight:function() {
	      return this.html.height();
	    },
	 
	    addFigure:function( figure , x,  y){
	        if(figure.getCanvas()===this){
	            return;
	        }
	        
	      figure.setCanvas(this);

	      // important inital 
	      figure.getShapeElement();
	      
	     
	      if(figure instanceof ashDraw.shape.basic.Line){
	        this.lines.add(figure);
	        this.linesToRepaintAfterDragDrop = this.lines;
	      }
	      else{
	        this.figures.add(figure);

	        if(typeof y !== "undefined"){
	            figure.setPosition(x,y);
	        }
	      }
	      
	      // init a repaint of the figure. This enforce that all properties
	      // ( color, dim, stroke,...) will be set.
	      figure.repaint();
	      figure.fireMoveEvent();
	    },

	    removeFigure:function(figure){
	        if(figure instanceof ashDraw.shape.basic.Line){
	           this.lines.remove(figure);
	         }
	        else {
	           this.figures.remove(figure);
	        }

	        figure.setCanvas(null);

	        if(figure instanceof ashDraw.Connection){
	           figure.disconnect();
	        }

	        if(this.currentSelection === figure){
	          this.setCurrentSelection(null);
	        }
	    },
	    
	    getLines:function(){
	      return this.lines;
	    },

	    getFigures:function(){
	      return this.figures;
	    },

	    getLine:function( id){
	      var count = this.lines.getSize();
	      for(var i=0; i<count;i++)
	      {
	         var line = this.lines.get(i);
	         if(line.getId()===id){
	            return line;
	         }
	      }
	      return null;
	    },

	    getFigure:function(/*:String*/ id){
	      for(var i=0; i<this.figures.getSize();i++)
	      {
	         var figure = this.figures.get(i);
	         if(figure.id==id){
	            return figure;
	         }
	      }
	      return null;
	    },

	    getIntersection:function(line){
	       var result = new ashDraw.util.ArrayList();
	       this.lineIntersections.each($.proxy(function(i, entry){
	           if(entry.line ===line){
	               result.addAll(entry.intersection);
	           }
	       },this));
	       return result;
	    },
	    
	    setSnapToGrid:function( flag){
	      if(flag===true){
	       this.snapToGridHelper = new ashDraw.SnapToGrid(this);
	      }
	      else{
	       this.snapToGridHelper = null;
	      }
	    },

	    getSnapToGrid:function(){
	      return this.snapToGridHelper !== null;
	    },

	    setSnapToGeometry:function( flag){
	      if(flag===true){
	       this.snapToGeometryHelper = new ashDraw.SnapToGeometry(this);
	      }
	      else{
	       this.snapToGeometryHelper = null;
	      }
	    },

	    getSnapToGeometry:function(){
	      return this.snapToGeometryHelper !== null;
	    },

	    snapToHelper:function(figure,  pos){
	       var snapDirections=0;
	       var snapPoint = null;
	       var result =null;
	       if(this.snapToGeometryHelper!==null)
	       {
	          // The user drag&drop a ResizeHandle
	          //
	          if(figure instanceof ashDraw.ResizeHandle)
	          {
	             snapPoint = figure.getSnapToGridAnchor();
	             pos.x+= snapPoint.x;
	             pos.y+= snapPoint.y;
	             var result1 = new ashDraw.geo.Point(pos.x,pos.y);
	             var result2 = new ashDraw.geo.Point(pos.x,pos.y);
	             if(figure.supportsSnapToHelper())
	             {
	                snapDirections = figure.getSnapToDirection();
	                var direction1 = this.snapToGeometryHelper.snapPoint(ashDraw.SnapToHelper.EAST_WEST, pos,result1);
	                var direction2 = this.snapToGeometryHelper.snapPoint(ashDraw.SnapToHelper.NORTH_SOUTH, pos,result2);
	                // Show a vertical line if the snapper has modified the inputPoint
	                //
	                if((snapDirections & ashDraw.SnapToHelper.EAST_WEST) && !(direction1 & ashDraw.SnapToHelper.EAST_WEST)){
	                   this.showSnapToHelperLineVertical(result1.x);
	                }
	                else{
	                   this.hideSnapToHelperLineVertical();
	                }

	                // Show a horizontal line if the snapper has modified the inputPoint
	                //
	                if((snapDirections & ashDraw.SnapToHelper.NORTH_SOUTH) && !(direction2 & ashDraw.SnapToHelper.NORTH_SOUTH)){
	                   this.showSnapToHelperLineHorizontal(result2.y);
	                }
	                else{
	                   this.hideSnapToHelperLineHorizontal();
	                }

	             }
	             result1.x-= snapPoint.x;
	             result2.y-= snapPoint.y;
	             return new ashDraw.geo.Point(result1.x,result2.y);
	          }
	          // The user drag&drop a normal figure
	          else
	          {
	             var inputBounds = new ashDraw.geo.Rectangle(pos.x,pos.y, figure.getWidth(), figure.getHeight());
	             result = new ashDraw.geo.Rectangle(pos.x,pos.y, figure.getWidth(), figure.getHeight());

	             snapDirections = ashDraw.SnapToHelper.NSEW;
	             var direction = this.snapToGeometryHelper.snapRectangle( inputBounds, result);

	             // Show a vertical line if the snapper has modified the inputPoint
	             //
	             if((snapDirections & ashDraw.SnapToHelper.WEST) && !(direction & ashDraw.SnapToHelper.WEST)){
	                this.showSnapToHelperLineVertical(result.x);
	             }
	             else if((snapDirections & ashDraw.SnapToHelper.EAST) && !(direction & ashDraw.SnapToHelper.EAST)){
	                this.showSnapToHelperLineVertical(result.getX()+result.getWidth());
	             }
	             else{
	                this.hideSnapToHelperLineVertical();
	             }

	             // Show a horizontal line if the snapper has modified the inputPoint
	             //
	             if((snapDirections & ashDraw.SnapToHelper.NORTH) && !(direction & ashDraw.SnapToHelper.NORTH)){
	                this.showSnapToHelperLineHorizontal(result.y);
	             }
	             else if((snapDirections & ashDraw.SnapToHelper.SOUTH) && !(direction & ashDraw.SnapToHelper.SOUTH)){
	                this.showSnapToHelperLineHorizontal(result.getY()+result.getHeight());
	             }
	             else{
	                this.hideSnapToHelperLineHorizontal();
	             }

	             return result.getTopLeft();
	          }
	       }
	       else if(this.snapToGridHelper!==null)
	       {
	          snapPoint = figure.getSnapToGridAnchor();
	          pos.x= pos.x+snapPoint.x;
	          pos.y= pos.y+snapPoint.y;
	          
	          result = new ashDraw.geo.Point(pos.x,pos.y);
	          this.snapToGridHelper.snapPoint(0,pos,result);
	          result.x= result.x-snapPoint.x;
	          result.y= result.y-snapPoint.y;
	          return result;
	       }

	       return pos;
	    },

	    showConnectionLine:function(/*:int*/ x1  ,/*:int*/ y1 ,/*:int*/ x2,/*:int*/ y2 ){
	      this.connectionLine.setStartPoint(x1,y1);
	      this.connectionLine.setEndPoint(x2,y2);
	      
	      this.connectionLine.setCanvas(this);
	      this.connectionLine.getShapeElement();
	    },

	    hideConnectionLine:function(){
	       this.connectionLine.setCanvas(null);
	    },

	    registerPort:function(port ){
	      // All elements have the same drop targets.
	      //
	      port.targets= this.dropTargets;
	      
	      this.commonPorts.add(port);
	      this.dropTargets.add(port);
	    },

	    unregisterPort:function(port ){
	      port.targets=null;

	      this.commonPorts.remove(port);
	      this.dropTargets.remove(port);
	    },

	    getCommandStack:function(){
	      return this.commandStack;
	    },

	    getCurrentSelection:function(){
	      return this.currentSelection;
	    },

	    setCurrentSelection:function( figure ){
	      if(figure===null){
	        this.hideResizeHandles();
	        this.hideLineResizeHandles();
	      }

	      if(figure instanceof ashDraw.shape.basic.Line){
	          this.showLineResizeHandles(figure);
	      }
	      else if(figure instanceof ashDraw.Figure){
	          this.showResizeHandles(figure);
	      }
	      
	      this.currentSelection = figure;

	      // inform all selection listeners about the new selection.
	      //
	      for(var i=0;i < this.selectionListeners.getSize();i++){
	        var w = this.selectionListeners.get(i);
	        if(typeof w.onSelectionChanged === "function"){
	          w.onSelectionChanged(this.currentSelection);
	        }
	      }
	    },

	    addSelectionListener:function(w){
	      if(w!==null)
	      {
	        if(typeof w ==="function"){
	            var obj = {};
	            obj.onSelectionChanged = w;
	            this.selectionListeners.add(obj);
	        } 
	        else if(typeof w.onSelectionChanged==="function"){
	          this.selectionListeners.add(w);
	        }
	        else{
	          throw "Object doesn't implement required callback method [onSelectionChanged]";
	        }
	      }
	    },

	    removeSelectionListener:function(/*:Object*/ w ){
	      this.selectionListeners.remove(w);
	    },

	    getBestFigure : function(x, y, figureToIgnore){
	        var result = null;
	        var testFigure = null;
	        var i=0;
	        // ResizeHandles first
	        for ( i = 0, len = this.resizeHandles.getSize(); i < len; i++)
	        {
	            testFigure = this.resizeHandles.get(i);
	            if (testFigure.isVisible()===true && testFigure.hitTest(x, y) === true && testFigure !== figureToIgnore) 
	            { 
	                return testFigure; 
	            }
	        }

	        // Checking ports
	        for ( i = 0, len = this.commonPorts.getSize(); i < len; i++) 
	        {
	            testFigure = this.commonPorts.get(i);
	            if(testFigure !== figureToIgnore)
	            {
	                if (testFigure.isVisible()===true && testFigure.hitTest(x, y) === true) 
	                { 
	                    return testFigure; 
	                }
	            }
	        }

	        // 2.) A line is the next option in the priority queue for a "Best" figure
	        //
	        result = this.getBestLine(x,y,figureToIgnore);
	        if(result !==null){
	            return result;
	        }
	        
	        // 3.) Check now the common objects
	        //
	        for ( i = 0; i < this.figures.getSize(); i++)
	        {
	            var figure = this.figures.get(i);
	            if (figure.isVisible()===true && figure.hitTest(x, y) === true && figure !== figureToIgnore)
	            {
	                if (result === null){
	                    result = figure;
	                }
	                else if(result.getZOrder()< figure.getZOrder())  {
	                    result = figure;
	                }
	            }
	            else{
	                var children= figure.getChildren();
	                children.each(function(i,e){
	                    if(e.isVisible()===true && e.hitTest(x,y)===true){
	                        result = e;
	                        return false; // break the each-loop
	                    }
	                    return true;
	                });
	            }
	        }
	        if(result !==null){
	            return result;
	        }
	        
	        // 4.) Check the children of the lines as well
	        //     Not selectable/draggable. But should receive onClick/onDoubleClick events 
	       //      as well.
	        var count = this.lines.getSize();
	        for(i=0;i< count;i++)
	        {
	          var line = this.lines.get(i);
	          children= line.getChildren();
	          children.each(function(i,e){
	              if(e.isVisible()===true && e.hitTest(x,y)===true){
	                  result = e;
	                  return false;
	              }
	              return true;
	          });
	        }
	        
	       return result;
	    },

	    getBestLine:function( x,  y,  lineToIgnore){
	      var result = null;
	      var count = this.lines.getSize();

	      for(var i=0;i< count;i++)
	      {
	        var line = this.lines.get(i);
	        if(line.isVisible()===true && line.hitTest(x,y)===true && line!==lineToIgnore)
	        {
	            if(result===null){
	               result = line;
	               break;
	            }
	        }
	      }
	      return result;
	    }, 

	    showLineResizeHandles:function( line ){
	      var resizeWidthHalf = this.resizeHandleStart.getWidth()/2;
	      var resizeHeightHalf= this.resizeHandleStart.getHeight()/2;
	      
	      var startPoint = line.getStartPoint();
	      var endPoint   = line.getEndPoint();
	      
	      this.resizeHandleStart.show(this,startPoint.x-resizeWidthHalf,startPoint.y-resizeHeightHalf);
	      this.resizeHandleEnd.show(this,endPoint.x-resizeWidthHalf,endPoint.y-resizeHeightHalf);

	      this.resizeHandleStart.setDraggable(line.isResizeable());
	      this.resizeHandleEnd.setDraggable(line.isResizeable());
	    },

	    hideLineResizeHandles:function(){
	        this.resizeHandleStart.hide();
	        this.resizeHandleEnd.hide();
	    },
	    
	    showResizeHandles:function(figure){
	     
	      if( this.getCurrentSelection()!==figure){
	        this.hideLineResizeHandles();
	        this.hideResizeHandles();
	      }
	      
	      // reset to the default width/height of the resize handle. The figure can change these
	      //
	      this.resizeHandle1.setDimension();
	      this.resizeHandle2.setDimension();
	      this.resizeHandle3.setDimension();
	      this.resizeHandle4.setDimension();
	      this.resizeHandle5.setDimension();
	      this.resizeHandle6.setDimension();
	      this.resizeHandle7.setDimension();
	      this.resizeHandle8.setDimension();

	      figure.showResizeHandles(this, this.resizeHandle1, this.resizeHandle2, this.resizeHandle3, this.resizeHandle4, this.resizeHandle5, this.resizeHandle6, this.resizeHandle7, this.resizeHandle8);
	    },

	    hideResizeHandles:function(){
	       this.resizeHandle1.hide();
	       this.resizeHandle2.hide();
	       this.resizeHandle3.hide();
	       this.resizeHandle4.hide();
	       this.resizeHandle5.hide();
	       this.resizeHandle6.hide();
	       this.resizeHandle7.hide();
	       this.resizeHandle8.hide();
	    },

	    moveResizeHandles:function( figure){
	        figure.moveResizeHandles(this, this.resizeHandle1, this.resizeHandle2, this.resizeHandle3, this.resizeHandle4, this.resizeHandle5, this.resizeHandle6, this.resizeHandle7, this.resizeHandle8);
	    },

	    hideSnapToHelperLines:function(){
	      this.hideSnapToHelperLineHorizontal();
	      this.hideSnapToHelperLineVertical();
	    },

	    hideSnapToHelperLineHorizontal:function(){
	       if(this.horizontalSnapToHelperLine!==null)
	       {
	          this.removeFigure(this.horizontalSnapToHelperLine);
	          this.horizontalSnapToHelperLine = null;
	       }
	    },

	    hideSnapToHelperLineVertical:function(){
	       if(this.verticalSnapToHelperLine!==null)
	       {
	          this.removeFigure(this.verticalSnapToHelperLine);
	          this.verticalSnapToHelperLine = null;
	       }
	    },

	    onDragEnter : function( draggedDomNode ){
	    },
	 
	    onDrag:function(draggedDomNode, x, y ){
	    },
	    
	    onDragLeave:function( draggedDomNode ){
	    },

	    onDrop:function(droppedDomNode, x, y){
	    },
	    
	    onKeyDown:function( /*:int*/ keyCode, /*:boolean*/ ctrl){
	      // Figure l�scht sich selbst, da dies den KeyDown Event empfangen
	      // kann. Bei einer Linie geht dies leider nicht, und muss hier abgehandelt werden.
	      //
	      if(keyCode==46 && this.currentSelection!==null){
	         this.commandStack.execute(this.currentSelection.createCommand(new ashDraw.command.CommandType(ashDraw.command.CommandType.DELETE)));
	      }
	      else if(keyCode==90 && ctrl){
	         this.commandStack.undo();
	      }
	      else if(keyCode==89 && ctrl){
	         this.commandStack.redo();
	      }
	      else if(keyCode ===107){
	          this.setZoom(this.zoomFactor*0.95);
	      }
	      else if(keyCode ===109){
	          this.setZoom(this.zoomFactor*1.05);
	      }
	    },

	    onDoubleClick : function(/* :int */x, /* :int */y){
	        // check if a line has been hit
	        //
	        var figure = this.getBestFigure(x, y);

	        if(figure!==null){
	            figure.onDoubleClick();
	        }

	    },

	    onClick : function(/* :int */x, /* :int */y){
	        // check if a line has been hit
	        //
	        var figure = this.getBestFigure(x, y);

	        if(figure!==null){
	            figure.onClick();
	        }
	    },

	    onRightMouseDown : function(/* :int */x, /* :int */y){
	       var figure = this.getBestFigure(x, y);
	        if(figure!==null){
	            figure.onContextMenu(x,y);
	        }
	    },
	        
	    onMouseDown : function(/* :int */x, /* :int */y){
	        var canDragStart = true;

	        var figure = this.getBestFigure(x, y);

	        // check if the user click on a child shape. DragDrop and movement must redirect
	        // to the parent
	        // Exception: Port's
	        if((figure!==null && figure.getParent()!==null) && !(figure instanceof ashDraw.Port)){
	            figure = figure.getParent();
	        }

	        if (figure !== null && figure.isDraggable()) {
	            canDragStart = figure.onDragStart(x - figure.getAbsoluteX(), y - figure.getAbsoluteY());
	            // Element send a veto about the drag&drop operation
	            if (canDragStart === false) {
	                this.mouseDraggingElement = null;
	                this.mouseDownElement = figure;
	            }
	            else {
	                this.mouseDraggingElement = figure;
	                this.mouseDownElement = figure;
	            }
	        }

	        if (figure !== this.currentSelection && figure !== null && figure.isSelectable() === true) {

	            this.hideResizeHandles();
	            this.setCurrentSelection(figure);

	            // its a line
	            if (figure instanceof ashDraw.shape.basic.Line) {
	                // you can move a line with Drag&Drop...but not a connection.
	                // A Connection is fixed linked with the corresponding ports.
	                //
	                if (!(figure instanceof ashDraw.Connection)) {
	                    this.draggingLineCommand = figure.createCommand(new ashDraw.command.CommandType(ashDraw.command.CommandType.MOVE));
	                    if (this.draggingLineCommand !== null) {
	                        this.draggingLine = figure;
	                    }
	                }
	            }
	            else if (canDragStart === false) {
	                this.setCurrentSelection(null);
	            }
	        }
	        else if (figure === null) {
	            this.setCurrentSelection(null);
	        }
	    },
	    
	    onMouseMove : function(/* :int */dx,/* :int */dy){
	    },
	    
	    onMouseDrag : function(/* :int */dx,/* :int */dy){
	       if (this.mouseDraggingElement !== null) {
	           
	            // it is only neccessary to repaint all connections if we change the layout of any connection
	            // This can only happen if we:
	            //    - at least one intersection
	            //    - we move a "Node. Only a node can have ports ans connections
	            if(this.linesToRepaintAfterDragDrop.isEmpty()===true && (this.mouseDraggingElement instanceof ashDraw.shape.node.Node)){
	                var nodeConnections = this.mouseDraggingElement.getConnections();
	                var newLineIntersections = this.lineIntersections.clone();
	                this.lineIntersections.each($.proxy(function(i, inter){
	                    
	                    if(nodeConnections.contains(inter.line) || nodeConnections.contains(inter.other)){
	                        newLineIntersections.remove(inter);
	                        this.linesToRepaintAfterDragDrop.add(inter.line);
	                        this.linesToRepaintAfterDragDrop.add(inter.other);
	                    }
	                },this));
	                this.lineIntersections = newLineIntersections;
	                this.linesToRepaintAfterDragDrop.each(function(i, line){
	                    line.svgPathString=null;
	                    line.repaint();
	                });
	            }
	            
	            // Can be a ResizeHandle or a normla Figure
	            //
	            this.mouseDraggingElement.onDrag(dx, dy);
	            
	            var p = this.fromDocumentToCanvasCoordinate(this.mouseDownX + (dx/this.zoomFactor), this.mouseDownY + (dy/this.zoomFactor));           
	            var target = this.getBestFigure(p.x, p.y,this.mouseDraggingElement);
	            
	            if (target !== this.currentDropTarget) {
	                if (this.currentDropTarget !== null) {
	                    this.currentDropTarget.onDragLeave(this.mouseDraggingElement);                     
	                    this.currentDropTarget = null;
	                }
	                if (target !== null) {
	                    this.currentDropTarget = target.onDragEnter(this.mouseDraggingElement);
	                }
	            }
	       }
	       else if(this.mouseDownElement!==null){
	           this.mouseDownElement.onPanning(dx, dy);
	       }
	    },

	    onMouseUp : function(){
	        if (this.mouseDraggingElement !== null) {
	            this.mouseDraggingElement.onDragEnd();
	            if(this.currentDropTarget!==null){
	               this.mouseDraggingElement.onDrop(this.currentDropTarget);
	               this.currentDropTarget.onDragLeave(this.mouseDraggingElement);
	               this.currentDropTarget = null;
	            }
	            this.mouseDraggingElement = null;
	        }
	        this.mouseDownElement = null;
	    }
	});
});