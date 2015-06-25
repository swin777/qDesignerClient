define(["dojo/_base/declare",
        "ashDraw/Canvas",
        "ashDraw/shape/basic/Line",
        "ashDraw/util/ArrayList",
        "ashDraw/Port",
        "ashDraw/Connection",
        "ashDraw/command/CommandAdd",
        "ashDraw/shape/basic/Line",
        "ashDraw/ResizeHandle",
        "ashDraw/command/CommandType",
        "ashDraw/shape/basic/Rectangle",
        "ashDraw/shape/node/Node",
        "ashDraw/command/CommandDelete",
        "ashDraw/command/CommandAdd",
        "ashDraw/command/CommandMove",
        "ashDraw/layout/connection/DirectRouter",
        "ashDraw/decoration/connection/ArrowDecorator",
        "ashDraw/shape/basic/Label",
        "ashDraw/layout/locator/BottomLocator",
        "ashDrawEx/VolatilePort",
        "ashDrawEx/shape/node/basic/CustomSvgFigure",
        "ashDrawEx/shape/node/basic/Group"], function(declare){
	return declare("ashDrawEx.ExCanvas", ashDraw.Canvas, {
		
		NAME : "ashDrawEx.ExCanvas",
		
		"-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor:function(id){
	    	this.inherited(arguments, [id]);
			this.setScrollArea("#"+id);
			this.currentDropConnection = null;
			this.c = false;
			this.selectionExtent = false;
			this.selectRectangle = null;
			this.currentMultiSelection = new ashDraw.util.ArrayList();
			this.resizeHandleArr = new ashDraw.util.ArrayList(); 
			this.multiStartDrag = false;
			this.resizeHandleVar = null;
			this.volatilePort = new ashDrawEx.VolatilePort(this);
			this.portDragMode = false;
			this.connectType = "DirectRouter";
			this.labelView = true;
		},
		
		reDragAbleReg:function(){
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
		},
		
		onMouseOver : function(x, y, figure){
	    	//var figure = this.getBestFigure(x, y);
	    	if(figure===null || this.portDragMode){
	    		return;
	    	}
	    	if(figure == this.currentSelection){
	    		this.portHide();
	    		return;
	    	}
	    	if(figure instanceof ashDraw.Port){
	    		figure = figure.getParent();
	    	}
	    	if(figure instanceof ashDraw.Connection){
	    		figure = figure.getSource();
	    	}
	    	this.portHide(figure);
	    	if(figure===null){
	    		return;
	    	}
	    	for ( i = 0; i < figure.hybridPorts.getSize(); i++) {
	        	figure.hybridPorts.get(i).setVisible(true);
	        }
	        for ( i = 0; i < figure.inputPorts.getSize(); i++) {
	        	figure.inputPorts.get(i).setVisible(true);
	        }
	        for ( i = 0; i < figure.outputPorts.getSize(); i++) {
	        	figure.outputPorts.get(i).setVisible(true);
	        }
	  	},
	  	
	  	onMouseOut : function(x, y, figure){
	  		// var figure = this.getBestFigure(x, y);
	  		// if(figure===null){
	  			// this.portHide();
	  		// }
	  	},
	  	
	  	portHide:function(figureToIgnore){
	  		for ( i = 0; i < this.figures.getSize(); i++){
	            var figure = this.figures.get(i);
	            if(figureToIgnore!=figure){
	            	 for ( k = 0; k < figure.hybridPorts.getSize(); k++) {
	        		figure.hybridPorts.get(k).setVisible(false);
			        }
			        for ( b = 0; b < figure.inputPorts.getSize(); b++) {
			        	figure.inputPorts.get(b).setVisible(false);
			        }
			        for ( s = 0; s < figure.outputPorts.getSize(); s++) {
			        	figure.outputPorts.get(s).setVisible(false);
			        }	
	            }
	        }
	  	},
	  	
	  	portShow:function(figureToIgnore){
	  		for ( i = 0; i < this.figures.getSize(); i++){
	            var figure = this.figures.get(i);
	            if(figureToIgnore!=figure){
	            	 for ( k = 0; k < figure.hybridPorts.getSize(); k++) {
	        		figure.hybridPorts.get(k).setVisible(true);
			        }
			        for ( b = 0; b < figure.inputPorts.getSize(); b++) {
			        	figure.inputPorts.get(b).setVisible(true);
			        }
			        for ( s = 0; s < figure.outputPorts.getSize(); s++) {
			        	figure.outputPorts.get(s).setVisible(true);
			        }	
	            }
	        }
	  	},

	    onDrag:function(droppedDomNode, x, y ){
	    },
	    
	    onDrop : function(droppedDomNode, x, y){
			var nodeId = $(droppedDomNode).data("node-id");
			var notationNode = Ext.getCmp(nodeId);
			var figure = notationNode.createFigure();
	        // create a command for the undo/redo support
	        if($('#' + this.canvasId).css("background-image")!="none"){
	        	var tmpX = x/10;
	        	var tmpY = y/10;
	        	x = Math.round(tmpX) * 10;
	        	y = Math.round(tmpY) * 10;
	        }
	         var command = new ashDraw.command.CommandAdd(this, figure, x, y);
	        this.getCommandStack().execute(command);
	    },
	    
	    onMouseDown : function(x, y, clickFigure){
	    	var canDragStart = true;
	    	var figure
			if (typeof clickFigure != "undefined" && clickFigure!==null){
				figure = clickFigure;
			}else{
				figure = this.getBestFigure(x, y);
				if(figure instanceof ashDrawEx.shape.node.basic.Group){
					figure = null;
				}
				if(figure!=null && !(figure instanceof ashDraw.shape.basic.Line)){
					return;
				}
			}
	        if(figure===null){
	        	this.portHide();
	        }
	        
	        var selectAgreement = false;
	        if(this.currentMultiSelection.getSize()>0 && figure!==null && !(figure instanceof ashDraw.ResizeHandle)){ //여러개 선택인지 검사
	        	for(i=0; i<this.currentMultiSelection.getSize(); i++){
	        		var selectFigure = this.currentMultiSelection.get(i);
	        		this.multiStartDrag = selectFigure.onDragStart(x - selectFigure.getAbsoluteX(), y - selectFigure.getAbsoluteY());
	        		if(selectFigure===figure){
	        			selectAgreement = true;
	        		}
	        	}
	    	}else if(this.currentMultiSelection.getSize()>0 && figure!==null && (figure instanceof ashDraw.ResizeHandle)){
	    		if(figure.masterFigure.resizeHandle1===figure){
	    			this.resizeHandleVar = "resizeHandle1";	
	    		}else if(figure.masterFigure.resizeHandle2===figure){
	    			this.resizeHandleVar = "resizeHandle2";	
	    		}else if(figure.masterFigure.resizeHandle3===figure){
	    			this.resizeHandleVar = "resizeHandle3";	
	    		}else if(figure.masterFigure.resizeHandle4===figure){
	    			this.resizeHandleVar = "resizeHandle4";	
	    		}else if(figure.masterFigure.resizeHandle5===figure){
	    			this.resizeHandleVar = "resizeHandle5";	
	    		}else if(figure.masterFigure.resizeHandle6===figure){
	    			this.resizeHandleVar = "resizeHandle6";	
	    		}else if(figure.masterFigure.resizeHandle7===figure){
	    			this.resizeHandleVar = "resizeHandle7";	
	    		}else if(figure.masterFigure.resizeHandle8===figure){
	    			this.resizeHandleVar = "resizeHandle8";	
	    		}
	    		for(i=0; i<this.currentMultiSelection.getSize(); i++){
	    			this.multiStartDrag = this.currentMultiSelection.get(i)[this.resizeHandleVar].onDragStart(this.currentMultiSelection.get(i));
	    		}
	    		selectAgreement = true;
	    	}
	    	
	    	if(selectAgreement){
	    		return;
	    	}
	    	
	        if((figure!==null && figure.getParent()!==null) && !(figure instanceof ashDraw.Port)){
	            figure = figure.getParent();
	        }
	        
	        if(figure instanceof ashDraw.Port && !(figure instanceof ashDrawEx.VolatilePort)){
	        	this.portDragMode = true;
	            this.portShow();
	        }

	        if (figure !== null && figure.isDraggable()) {
	        	canDragStart = figure.onDragStart(x - figure.getAbsoluteX(), y - figure.getAbsoluteY());
	            
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

	            if (figure instanceof ashDraw.shape.basic.Line) {
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
	            this.selectionExtent = true;
	            this.selectRectangle = new ashDraw.shape.basic.Rectangle();
	            this.selectRectangle.width = 0;
	            this.selectRectangle.height = 0;
	            this.selectRectangle.alpha = 0.2;
	            this.selectOldX = x;
	            this.selectOldY = y;
	            this.addFigure( this.selectRectangle,x,y);
	        }
	    },
	    
	    onMouseDrag : function(/* :int */dx,/* :int */dy)
	    {
	       if(this.currentMultiSelection.getSize()>0 && this.multiStartDrag){
	       	if(this.resizeHandleVar===null){
	       		for(i=0; i<this.currentMultiSelection.getSize(); i++){
	   				this.figureDrag(dx, dy, this.currentMultiSelection.get(i));
	   			}
	       	}else{
	       		for(i=0; i<this.currentMultiSelection.getSize(); i++){
	   				this.figureDrag(dx, dy, this.currentMultiSelection.get(i)[this.resizeHandleVar]);
	   			}
	       	}
	   			
	       }else{
	       		if (this.mouseDraggingElement !== null) {
	            this.figureDrag(dx, dy, this.mouseDraggingElement);
		       }
		       else if(this.mouseDownElement!==null){
		           this.mouseDownElement.onPanning(dx, dy);
		       }else{
		       	if(this.selectionExtent){
		           	this.selectRectangle.width = dx;
		            this.selectRectangle.height = dy;
		            
		            if(this.selectRectangle.width<0){
		            	this.selectRectangle.width = Math.abs(dx);
		            	this.selectRectangle.x = this.selectOldX + dx;
		            }else{
		            	this.selectRectangle.x = this.selectOldX;
		            }
		            
		            if(this.selectRectangle.height<0){
		            	this.selectRectangle.height = Math.abs(dy);
		            	this.selectRectangle.y = this.selectOldY + dy;
		            }else{
		            	this.selectRectangle.y = this.selectOldY;
		            }
		            this.selectRectangle.repaint();
		        }else{
		        	 this.mouseActClear();
		        }
		       }
	       }
	       
	       
	    },
	    
	    figureDrag : function(/* :int */dx,/* :int */dy, mouseDragFigure){
	            if(this.linesToRepaintAfterDragDrop.isEmpty()===true && (mouseDragFigure instanceof ashDraw.shape.node.Node)){
	                var nodeConnections = mouseDragFigure.getConnections();
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
	            
	            mouseDragFigure.onDrag(dx, dy);
	            
	            var p = this.fromDocumentToCanvasCoordinate(this.mouseDownX + (dx/this.zoomFactor), this.mouseDownY + (dy/this.zoomFactor));           
	            var target = this.getBestFigure(p.x, p.y,mouseDragFigure);
	            
	            if (target !== this.currentDropTarget) {
	               if (this.currentDropTarget) {
	                    this.currentDropTarget.onDragLeave(mouseDragFigure);                     
	                    this.currentDropTarget = null;
	                }
	                if (target !== null) {
	                    this.currentDropTarget = target.onDragEnter(mouseDragFigure);
	                }
	            }
	    },
	    
	    onMouseUp : function()
	    {
	    	if(this.currentMultiSelection.getSize()>0 && this.multiStartDrag){
	    		if(this.resizeHandleVar===null){
			    	for(i=0; i<this.currentMultiSelection.getSize(); i++){
			   			this.currentMultiSelection.get(i).onDragEnd();
			   		}
			   	}else{
			   		for(i=0; i<this.currentMultiSelection.getSize(); i++){
			   			this.currentMultiSelection.get(i)[this.resizeHandleVar].onDragEnd();
			   		}
			   	}
		   	}
	        if (this.mouseDraggingElement !== null) {
	            this.mouseDraggingElement.onDragEnd();
	            if(this.currentDropTarget!==null){
	               this.mouseDraggingElement.onDrop(this.currentDropTarget);
	               this.currentDropTarget.onDragLeave(this.mouseDraggingElement);
	               this.currentDropTarget = null;
	            }
	            this.mouseDraggingElement = null;
	        }
	        this.mouseActClear();
	        this.portDragMode = false;
	    }, 
	    
	    mouseActClear : function(){
	    	this.mouseDownElement = null;
	        this.selectionExtent = false;
	        this.setMultiCurrentSelection(this.selectRectangle);
	        this.removeFigure(this.selectRectangle);
	        this.selectRectangle = null;
	        this.multiStartDrag = false;
	        this.resizeHandleVar = null;
	    },
	    
	    setMultiCurrentSelection : function(rectangle){
	    	if(rectangle===null){
	    		return;
	    	}
	    	try{
	    		this.currentMultiSelection.removeAllElements();
	    		this.resizeHandleArr.removeAllElements();
	    		var xMin = rectangle.x;
		    	var yMin = rectangle.y;
		    	var xMax = rectangle.x + rectangle.width;
		    	var yMax = rectangle.y + rectangle.height;
		    	
		    	var figures = this.getFigures();
		    	var figure = null;
		        for( i=0; i< figures.getSize();i++){
		        	figure = figures.get(i);
		        	if(figure!==rectangle){
		        		var fiSX = figure.x;
		            	var fiSY = figure.y;
		            	var fiEX = figure.x + figure.width;
		            	var fiEY = figure.y + figure.height;
		            	if(fiSX > xMin && fiSY > yMin && fiEX < xMax && fiEY < yMax){
			        		this.currentMultiSelection.add(figure);
			        		
			        		figure.resizeHandle1 = local_resizeHandle1 = new ashDraw.ResizeHandle(this,1); // 1 = LEFT TOP
					        figure.resizeHandle2 = local_resizeHandle2 = new ashDraw.ResizeHandle(this,2); // 2 = CENTER_TOP
					        figure.resizeHandle3 = local_resizeHandle3 = new ashDraw.ResizeHandle(this,3); // 3 = RIGHT_TOP
					        figure.resizeHandle4 = local_resizeHandle4 = new ashDraw.ResizeHandle(this,4); // 4 = RIGHT_MIDDLE
					        figure.resizeHandle5 = local_resizeHandle5 = new ashDraw.ResizeHandle(this,5); // 5 = RIGHT_BOTTOM
					        figure.resizeHandle6 = local_resizeHandle6 = new ashDraw.ResizeHandle(this,6); // 6 = CENTER_BOTTOM
					        figure.resizeHandle7 = local_resizeHandle7 = new ashDraw.ResizeHandle(this,7); // 7 = LEFT_BOTTOM
					        figure.resizeHandle8 = local_resizeHandle8 = new ashDraw.ResizeHandle(this,8); // 8 = LEFT_MIDDLE
					        figure.volatilePort =  local_volatilePort = new ashDrawEx.VolatilePort(this);
					        
					        local_resizeHandle1.setDimension();
					        local_resizeHandle2.setDimension();
					        local_resizeHandle3.setDimension();
					        local_resizeHandle4.setDimension();
					        local_resizeHandle5.setDimension();
					        local_resizeHandle6.setDimension();
					        local_resizeHandle7.setDimension();
					        local_resizeHandle8.setDimension();
					        
					        local_resizeHandle1.masterFigure = figure;
					        local_resizeHandle2.masterFigure = figure;
					        local_resizeHandle3.masterFigure = figure;
					        local_resizeHandle4.masterFigure = figure;
					        local_resizeHandle5.masterFigure = figure;
					        local_resizeHandle6.masterFigure = figure;
					        local_resizeHandle7.masterFigure = figure;
					        local_resizeHandle8.masterFigure = figure;
					        
					        this.resizeHandleArr.add(local_resizeHandle1);
					        this.resizeHandleArr.add(local_resizeHandle2);
					        this.resizeHandleArr.add(local_resizeHandle3);
					        this.resizeHandleArr.add(local_resizeHandle4);
					        this.resizeHandleArr.add(local_resizeHandle5);
					        this.resizeHandleArr.add(local_resizeHandle6);
					        this.resizeHandleArr.add(local_resizeHandle7);
					        this.resizeHandleArr.add(local_resizeHandle8);
					        this.resizeHandleArr.add(local_volatilePort);
			        		
			        		figure.showResizeHandles(this, local_resizeHandle1, local_resizeHandle2, local_resizeHandle3, 
			        								 local_resizeHandle4, local_resizeHandle5, local_resizeHandle6, 
			        								 local_resizeHandle7, local_resizeHandle8, local_volatilePort);
			        	}	
		        	}
		        }
		        for(var i=0;i < this.selectionListeners.getSize();i++)
			    {
			        var w = this.selectionListeners.get(i);
			        if(typeof w.onSelectionChanged === "function"){
			          w.onSelectionChanged(this.currentSelection, this.currentMultiSelection);
			        }
			    }
	    	}catch(e){console.log(e)}
	    },
	    
	    showResizeHandles:function(figure)
	    {
	      figure.resizeHandle1 = null;
	      figure.resizeHandle2 = null;
	      figure.resizeHandle3 = null;
	      figure.resizeHandle4 = null;
	      figure.resizeHandle5 = null;
	      figure.resizeHandle6 = null;
	      figure.resizeHandle7 = null;
	      figure.resizeHandle8 = null;
	      figure.volatilePort = null;
	      if( this.getCurrentSelection()!==figure)
	      {
	        this.hideLineResizeHandles();
	        this.hideResizeHandles(this);
	      }
	      
	      this.resizeHandle1.setDimension();
	      this.resizeHandle2.setDimension();
	      this.resizeHandle3.setDimension();
	      this.resizeHandle4.setDimension();
	      this.resizeHandle5.setDimension();
	      this.resizeHandle6.setDimension();
	      this.resizeHandle7.setDimension();
	      this.resizeHandle8.setDimension();

	      figure.showResizeHandles(this, this.resizeHandle1, this.resizeHandle2, this.resizeHandle3, this.resizeHandle4, this.resizeHandle5,
	      			 this.resizeHandle6, this.resizeHandle7, this.resizeHandle8, this.volatilePort);
	    },
	    
	    moveResizeHandles:function( figure)
	    {
	    	if (typeof figure.resizeHandle1 != "undefined" && figure.resizeHandle1!==null){
	    		figure.moveResizeHandles(this, figure.resizeHandle1, figure.resizeHandle2, figure.resizeHandle3, figure.resizeHandle4, 
	    				figure.resizeHandle5, figure.resizeHandle6, figure.resizeHandle7, figure.resizeHandle8, figure.volatilePort);
	    	}else{
	    		figure.moveResizeHandles(this, this.resizeHandle1, this.resizeHandle2, this.resizeHandle3, this.resizeHandle4, 
	    				this.resizeHandle5, this.resizeHandle6, this.resizeHandle7, this.resizeHandle8, this.volatilePort);
	    	}
	    },
	    
	    hideResizeHandles:function()
	    {
	       this.resizeHandle1.hide();
	       this.resizeHandle2.hide();
	       this.resizeHandle3.hide();
	       this.resizeHandle4.hide();
	       this.resizeHandle5.hide();
	       this.resizeHandle6.hide();
	       this.resizeHandle7.hide();
	       this.resizeHandle8.hide();
	       this.volatilePort.hide();
	       
	       this.resizeHandleArr.each(function(i, re){
			re.hide();
	       })
	       
	       this.resizeHandleArr.removeAllElements();
	    },
	    
	    removeFigureCommand:function(){
	    	var node = this.getCurrentSelection();
	    	if(node!==null){
	    		var command = new ashDraw.command.CommandDelete(node);
				this.getCommandStack().execute(command);	
	    	}
	    	
	        for(i=0; i<this.currentMultiSelection.getSize(); i++){
	        	var command2 = new ashDraw.command.CommandDelete(this.currentMultiSelection.get(i));
				this.getCommandStack().execute(command2);
	        }
	        
	        this.currentMultiSelection.removeAllElements();
	        this.resizeHandleArr.removeAllElements();
	    },
	    
	    removeFigure:function(figure){
	    	if(!figure){
	    		return;
	    	}
	 
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
	    
	    getBestFigure : function(x, y, figureToIgnore)
	    {
	        var result = null;
	        var testFigure = null;
	        var i=0;
	        
	        if (this.volatilePort.isVisible()===true && this.volatilePort.hitTest(x, y) === true && this.volatilePort !== figureToIgnore) 
	        { 
	        	return this.volatilePort; 
	        }
	       
	        for ( i = 0, len = this.resizeHandles.getSize(); i < len; i++)
	        {
	            testFigure = this.resizeHandles.get(i);
	            if (testFigure.isVisible()===true && testFigure.hitTest(x, y) === true && testFigure !== figureToIgnore) 
	            { 
	                return testFigure; 
	            }
	        }

	        for ( i = 0, len = this.resizeHandleArr.getSize(); i < len; i++){
	        	testFigure = this.resizeHandleArr.get(i);
	            if (testFigure.isVisible()===true && testFigure.hitTest(x, y) === true && testFigure !== figureToIgnore) 
	            { 
	                return testFigure; 
	            }
	        }

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

	        result = this.getBestLine(x,y,figureToIgnore);
	        if(result !==null){
	            return result;
	        }
	        
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
	    
	    horAlign : function(){
	    	if(this.currentMultiSelection.getSize()<2){
	    		return;
	    	}
	    	var baseFigure = this.currentMultiSelection.get(0);
	    	for(var i=1; i<this.currentMultiSelection.getSize(); i++){
				var figure = this.currentMultiSelection.get(i);
				figure.onDragStart(figure.x, figure.y);
				figure.setPosition(figure.x, baseFigure.y);
				figure.onDragEnd();
	        }
	    },
	    
	    verAlign : function(){
	    	if(this.currentMultiSelection.getSize()<2){
	    		return;
	    	}
	    	var baseFigure = this.currentMultiSelection.get(0);
	    	for(var i=1; i<this.currentMultiSelection.getSize(); i++){
				var figure = this.currentMultiSelection.get(i);
				figure.onDragStart(figure.x, figure.y);
				figure.setPosition(baseFigure.x, figure.y);
				figure.onDragEnd();
	        }
	    },
	    
	    addFigrueTypeCommand : function(type, x, y, originalFigure)
	    {
	        var figure;
	        if(type=='ashDrawEx.shape.node.basic.CustomSvgFigure'){
	        	figure = new ashDrawEx.shape.node.basic.CustomSvgFigure(originalFigure.node_id);
	        	figure.NAME = originalFigure.NAME;
				figure.width = originalFigure.width;
				figure.height = originalFigure.height;
	        }else{
	        	figure = eval("new "+type+"();");
	        }
	        var command = new ashDraw.command.CommandAdd(this, figure, x, y);
	        this.getCommandStack().execute(command);
	        return figure;
	    },
	    
	    addFigrueCommand : function(figure, x, y)
	    {
	        var command = new ashDraw.command.CommandAdd(this, figure, x, y);
	        this.getCommandStack().execute(command);
	        return figure;
	    },
	    
	    autoLayOut : function(algorithmType){
	        var nodes = new ashDraw.util.ArrayList();
	        for(var k=0; k<this.getFigures().getSize(); k++){
	        	var fig = this.getFigures().get(k);
	        	var node = new Object();
	        	node.id = fig.id;
	        	node.x = "0";
	        	node.y = "0";
	        	node.width = fig.width+"";
	        	node.height = fig.height+"";
	        	nodes.add(node);
	        }
	        
	        var connects = new ashDraw.util.ArrayList();
	        for(var i=0; i<this.getLines().getSize(); i++){
	    		var line = this.getLines().get(i);
	    		var connect = new Object();
	    		connect.sourceId = line.sourcePort.getParent().id;
	    		connect.targetId = line.targetPort.getParent().id;
	    		connects.add(connect);
	    	}
	    	
	    	//var algorithmType = "TreeLayout";
	    	var graphInfo = new Object();
	    	graphInfo.algorithmType = algorithmType;
	    	graphInfo.nodes = nodes.asArray();
	    	graphInfo.connects = connects.asArray();
	    	graphInfo.width = this.getWidth()*0.8;
	    	graphInfo.height = this.getHeight()*0.8;
	    	var paramObj = new Object();
	    	paramObj.graphInfo = graphInfo;
	    	
	    	var figures = this.getFigures();
			$.ajax({
			    url: 'http://ashDrawEx-graph-layout.appspot.com/service.jsp',
			    //url: 'http://127.0.0.1:8888/service.jsp',
			    type: 'POST',
			    async: false,
			    timeout: 36000,
			    dataType: 'text',
			    crossDomain: true,
			    data : "json=" + JSON.stringify(paramObj),
			    error:function(e){
	            	alert(e.status);
	            },
	            success:function(obj){
	                 var objArr = JSON.parse(obj);
	                 for(var i=0; i<objArr.length; i++){
	                 	for(var j=0; j<figures.getSize(); j++){
							var fig = figures.get(j);
							if(fig.id==objArr[i].id){
								var command = new ashDraw.command.CommandMove(fig);
								command.setPosition(objArr[i].x, objArr[i].y);
								command.execute();
								break;
							}
					  	}
	                 }
	            }
			});
			
			// Ext.Ajax.request({
			    // url: 'http://ashDrawEx-graph-layout.appspot.com/service.jsp',
			    // method: 'POST',
			    // params: {
			        // json: JSON.stringify(paramObj)
			    // },
			    // success: function(response){
			        // var text = response.responseText;
			        // var objArr = JSON.parse(text);
			        // for(var i=0; i<objArr.length; i++){
	                 	// for(var j=0; j<figures.getSize(); j++){
							// var fig = figures.get(j);
							// if(fig.id==objArr[i].id){
								// var command = new ashDraw.command.CommandMove(fig);
								// command.setPosition(objArr[i].x, objArr[i].y);
								// command.execute();
								// break;
							// }
					  	// }
	                 // }
			    // }
			// });
			
			// var delCommArr = new ashDraw.util.ArrayList();
		  	// for(var s=0; s<this.getLines().getSize(); s++){
	    		// var conn = this.getLines().get(s);
	    		// var command = new ashDraw.command.CommandDelete(conn);
	    		// delCommArr.add(command)
	    	// }
//	     	
	    	// for(var s=0; s<delCommArr.getSize(); s++){
	    		// var command = delCommArr.get(s);
				// command.execute();
				// this.minimumDistanceConnect(command.figure.getSource().getParent(), command.figure.getTarget().getParent());
	        // }  
	        
	        for(var s=0; s<this.getLines().getSize(); s++){
	    		var conn = this.getLines().get(s);
	    		conn.setRouter(new ashDraw.layout.connection.DirectRouter());
	    		this.minimumDistanceConnect(conn);
	    	} 
	    	
	    	Designer.app.eventbus.fireEvent('autoLayout');
	    },
	    
	    minimumDistanceConnect : function(conn){
	    	var sourcePortArr = conn.getSource().getParent().getPorts();
	      	var targetPortArr = conn.getTarget().getParent().getPorts();
	      	var selectPortInfo = null;
	      	for(var i=0; i<sourcePortArr.getSize(); i++){
	      		for(var k=0; k<targetPortArr.getSize(); k++){
	      			var currPortInfo = new Object();
	      			currPortInfo.startPort = sourcePortArr.get(i);
	      			currPortInfo.endPort = targetPortArr.get(k);
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
	      	
			conn.setTargetDecorator(new ashDraw.decoration.connection.ArrowDecorator());
	   	 	conn.setSource(selectPortInfo.startPort);
	   	 	conn.setTarget(selectPortInfo.endPort);
	   	 	var command = new ashDraw.command.CommandAdd(this, conn);
	   	 	command.execute();
	    },
	    
	    // minimumDistanceConnect : function(sourceFigure, targetFigure){
	    	// var sourcePortArr = sourceFigure.getPorts();
	      	// var targetPortArr = targetFigure.getPorts();
	      	// var selectPortInfo = null;
	      	// for(var i=0; i<sourcePortArr.getSize(); i++){
	      		// for(var k=0; k<targetPortArr.getSize(); k++){
	      			// var currPortInfo = new Object();
	      			// currPortInfo.startPort = sourcePortArr.get(i);
	      			// currPortInfo.endPort = targetPortArr.get(k);
	      			// this.pointToPointDistance(currPortInfo);
	      			// if(selectPortInfo===null){
	      				// selectPortInfo = currPortInfo;
	      			// }else{
	      				// if(currPortInfo.distance < selectPortInfo.distance){
	      					// selectPortInfo = currPortInfo;
	      				// }
	      			// }
	      		// }
	      	// }
//	       	
	      	// var conn = new ashDraw.Connection("DirectRouter");
			// conn.setTargetDecorator(new ashDraw.decoration.connection.ArrowDecorator());
	   	 	// conn.setSource(selectPortInfo.startPort);
	   	 	// conn.setTarget(selectPortInfo.endPort);
	   	 	// var command = new ashDraw.command.CommandAdd(this, conn);
	   	 	// command.execute();
	    // },
	    
	    pointToPointDistance : function(selectPortInfo){
	    	var point1 = new Object();
	    	var point2 = new Object();
	    	point1.x = selectPortInfo.startPort.x + selectPortInfo.startPort.getAbsoluteX();
	    	point1.y = selectPortInfo.startPort.y + selectPortInfo.startPort.getAbsoluteY();
	    	point2.x = selectPortInfo.endPort.x + selectPortInfo.endPort.getAbsoluteX();
	    	point2.y = selectPortInfo.endPort.y + selectPortInfo.endPort.getAbsoluteY();
	    	selectPortInfo.distance = Math.sqrt(Math.pow(Math.abs(point1.x-point2.x),2) + Math.pow(Math.abs(point1.y-point2.y),2))
	    },
	    
	    setConnectType : function(type){
	    	this.connectType = type;
	    },
	    
	    setSnapToGrid:function(flag){
	    	
	    },
	    
	    getSnapToGrid:function(){
	     	if($('#' + this.canvasId).css("background-image")=="none"){
	    		return false;
	    	}else{
	    		return true;
	    	} 
	    },
	    
	    setGrid:function(flag){
	    	if($('#' + this.canvasId).css("background-image")=="none"){
	    		$('#' + this.canvasId).css("background-image", "url(/dynagram/resources/images/designer/grid_10.png)"); 
	    	}else{
	    		$('#' + this.canvasId).css("background-image", ""); 
	    	} 
	    },
	    
	    labelViewToogle : function(){
	    	this.labelView = !this.labelView;
			for ( var i = 0; i < this.figures.getSize(); i++){
				var figure = this.figures.get(i);
				if(figure instanceof ashDrawEx.shape.node.basic.Group){
					continue;
				}
				var children = figure.getChildren();
				if(children.getSize()>0){
					if(children.get(0) instanceof ashDraw.shape.basic.Label){
						children.get(0).setVisible(this.labelView);
					}
				}else{
					var label = new ashDraw.shape.basic.Label("none");
			        //label.setColor("#000000");
			      	label.setFontColor("#0000ff");
			      	label.setStroke(0);
			      	label.setVisible(!this.labelView);
			        figure.addFigure(label, new ashDraw.layout.locator.BottomLocator(figure));
				}
			}
	   },
	   
	   figureAreaPostion : function(){
	   		var minX = this.scrollArea.width();
	   		var minY = this.scrollArea.height();
	   		var maxX = 0;
	   		var maxY = 0;
	   		for ( i = 0; i < this.figures.getSize(); i++){
	            var figure = this.figures.get(i);
	            
	            if(figure.x<minX){
	            	minX = figure.x;
	            }
	            if(figure.y<minY){
	            	minY = figure.y;
	            }
	            
	            if((figure.x+figure.width)>maxX){
	            	maxX = (figure.x+figure.width);
	            }
	            if((figure.y+figure.height)>maxY){
	            	maxY = (figure.y+figure.height)
	            }
	        }
	        return {minX:minX, minY:minY, maxX:maxX, maxY:maxY};
	   }
	});
});