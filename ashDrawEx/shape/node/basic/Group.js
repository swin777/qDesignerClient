define(["dojo/_base/declare", 
        "ashDraw/shape/basic/Rectangle", 
        "ashDrawEx/MyInputPortLocator", 
        "ashDrawEx/MyOutputPortLocator",
        "ashDraw/util/Color",
        "ashDraw/layout/locator/TopLocator",
        "ashDraw/shape/basic/Label"], function(declare){
	return declare("ashDrawEx.shape.node.basic.Group", ashDraw.shape.basic.Rectangle, {
	    NAME : "ashDrawEx.shape.node.basic.Group",
	    contain:true,
	    DEFAULT_COLOR : new ashDraw.util.Color("#C2E0FF"),
	    customChildren:[],
	    gLabel:'Group',

	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function() {
	    	var me = this;
			Designer.app.eventbus.on('unmarshalComplete', function(canvas) {
				if(canvas===this.getCanvas()){
					me.setCustomChildren();
				}
			}, this);
			this.inherited(arguments);
	        this.setDimension(150, 150);
	        this.setBackgroundColor(this.DEFAULT_COLOR);
	        this.setColor(this.DEFAULT_COLOR.darker());
	        //this.setStroke(0);
	        this.alpha = 0.5;
	        this.customChildren = [];
	        this.inputLocator = new ashDrawEx.MyInputPortLocator();
	        this.outputLocator = new ashDrawEx.MyOutputPortLocator();
	        this.createPort("hybrid",this.inputLocator);
	        this.createPort("hybrid",this.inputLocator);
	        this.createPort("hybrid",this.outputLocator);
	        this.createPort("hybrid",this.outputLocator);
	        
	        var children = this.getChildren();
	    	if(children.getSize()==0){
	    		var rect = new ashDraw.shape.basic.Rectangle(150, 20);
	    		rect.setBackgroundColor(new ashDraw.util.Color("#008AE6"));
	    		rect.alpha = 0.7;
	    		//rect.setStroke(0);
		        this.addFigure(rect, new ashDraw.layout.locator.TopLocator(this));
		        var label = new ashDraw.shape.basic.Label(this.gLabel);
		      	label.setFontColor("#ffffff");
		      	label.setStroke(0);
		      	this.addFigure(label, new ashDraw.layout.locator.TopLocator(this));
	    	}
	    },
	   
	    containTest:function(figure){
	    	var me = this;
	    	var fiSX = figure.x;
	    	var fiSY = figure.y;
	    	var fiEX = figure.x + figure.width;
	    	var fiEY = figure.y + figure.height;
	    	var thisEX = this.x + this.width;
	    	var thisEY = this.y + this.height;
	    	if(fiSX > this.x && fiSY > this.y && fiEX < thisEX && fiEY < thisEY){
	    		if(figure.gId && figure.gId==this.id){
	    			figure.dx = fiSX - this.x;
	        		figure.dy = fiSY - this.y;
	    		}else{
	    			figure.gId = this.id;
	        		figure.dx = fiSX - this.x;
	        		figure.dy = fiSY - this.y;
	    			me.customChildren.push(figure);
	    		}
	    		return true;
	    	}else{
	    		return false;
	    	}
	    },
	    
	    setDimension:function(w, h){
	    	var me = this;
	    	var children = this.getChildren();
	    	if(children.getSize()>0){
	    		children.get(0).setDimension(w, 20);
	    	}
	    	me.inherited(arguments, [w, h]);
	    },
	    
	    setPosition : function(x, y) {
	    	var me = this;
	    	if(me.customChildren){
	    		for(var i=0; i<me.customChildren.length; i++){
	    			var child = me.customChildren[i];
	        		if(x+child.dx === child.x && y+child.dy === child.y  ){
	                    return this;
	                }
	        		child.setPosition(x+child.dx, y+child.dy);
	    		}
	    	}
	        me.inherited(arguments, [x, y]);
	        return this;
	    },
	   
	   mousedownHandler:function(event){
		   
	   },
	   
	   setCustomChildren:function(){
		   var arr = this.getCanvas().getFigures().data;
		   for(var i=0; i<arr.length; i++){
			   var figure = arr[i];
			   if(figure && figure.gId && this.id == figure.gId){
				   this.customChildren.push(figure);
			   }
	   	   }
	   },
	   
	   getPersistentAttributes : function(){
	       var memento = this.inherited(arguments);
	       memento.gLabel = this.gLabel;    
	       return memento;
	   },
	   
	   setPersistentAttributes : function(memento){
	       this.inherited(arguments, [memento]);
	       this.gLabel = memento.gLabel;
	       
	       var children = this.getChildren();
		   if(children.getSize()>1){
		   		children.get(1).setText(this.gLabel);
		   }
	   }
	});
});