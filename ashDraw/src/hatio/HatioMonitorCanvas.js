dojo.declare("hatio.HatioMonitorCanvas", ashDraw.Canvas, {
	NAME : "hatio.HatioMonitorCanvas",
	
	"-chains-": {
        constructor: "manual"
    },
	
    constructor:function(id, callback){
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
		this.volatilePort = new hatio.VolatilePort(this);
		this.portDragMode = false;
		this.connectType = "DirectRouter";
		
		var filter1 = this.paper.filterCreate("blackAndWhite", this.paper); 
        var filterOp1 = Raphael.filterOps.feColorMatrix({"type": "luminanceToAlpha"});
		filter1.appendOperation(filterOp1);
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
    	
  	},
  	
  	onMouseOut : function(x, y, figure){
  		
  	},
  	
   
    onDrag:function(droppedDomNode, x, y )
    {
    },
    
    
    onDrop : function(droppedDomNode, x, y)
    {
		
    },
    
    onMouseDown : function(x, y, clickFigure){
    	var canDragStart = true;
    	var figure
		if (typeof clickFigure != "undefined" && clickFigure!==null){
			figure = clickFigure;
		}else{
			figure = this.getBestFigure(x, y);
			if(figure!=null){
				return;
			}
		}
        
    },
    
    onMouseDrag : function(/* :int */dx,/* :int */dy)
    {
    },

    onMouseUp : function()
    {
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
    
    figureOnBlackAndWhite:function(figureId){
    	var figure = this.getFigureOrLine(figureId);
    	if(figure){
    		figure.onBlackAndWhite();
    	}
    },
    
    figureOffBlackAndWhite:function(figureId){
    	var figure = this.getFigureOrLine(figureId);
    	if(figure){
    		figure.offBlackAndWhite();
    	}
    },
    
    figureOnGlowToogleStart:function(figureId){
    	var figure = this.getFigureOrLine(figureId);
    	if(figure){
    		figure.onGlowToogleStart();
    	}
    },
    
    figureOnGlowToogleStop:function(figureId){
    	var figure = this.getFigureOrLine(figureId);
    	if(figure){
    		figure.onGlowToogleStop();
    	}
    },
    
    figureSetLabel:function(figureId, data){
    	var figure = this.getFigureOrLine(figureId);
    	if(figure){
    		if(figure instanceof hatio.shape.node.basic.Label){
    			figure.setText(data);
    		}
    	}
    },
    
    getFigureOrLine:function(id){
    	var obj = this.getFigure(id);
    	if(obj){
    		return obj;
    	}else{
    		return this.getLine(id);
    	}
    }
});