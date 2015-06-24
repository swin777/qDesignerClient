hatio.shape.node.basic.Group = graphiti.shape.basic.Rectangle.extend({
    NAME : "hatio.shape.node.basic.Group",
    
    DEFAULT_COLOR : new graphiti.util.Color("#C2E0FF"),
    
    customChildren:[],
    gLabel:'Group',

	init : function(){
		var me = this;
		Designer.app.eventbus.on('unmarshalComplete', function(canvas) {
			if(canvas===this.getCanvas()){
				me.setCustomChildren();
			}
		}, this);
        this._super();
        this.setDimension(150, 150);
        this.setBackgroundColor(this.DEFAULT_COLOR);
        this.setColor(this.DEFAULT_COLOR.darker());
        //this.setStroke(0);
        this.alpha = 0.5;
        this.customChildren = [];
        this.inputLocator = new this.MyInputPortLocator();
        this.outputLocator = new this.MyOutputPortLocator();
        this.createPort("hybrid",this.inputLocator);
        this.createPort("hybrid",this.inputLocator);
        this.createPort("hybrid",this.outputLocator);
        this.createPort("hybrid",this.outputLocator);
        
        var children = this.getChildren();
    	if(children.getSize()==0){
    		var rect = new graphiti.shape.basic.Rectangle(150, 20);
    		rect.setBackgroundColor(new graphiti.util.Color("#008AE6"));
    		rect.alpha = 0.7;
    		//rect.setStroke(0);
	        this.addFigure(rect, new graphiti.layout.locator.TopLocator(this));
	        var label = new graphiti.shape.basic.Label(this.gLabel);
	      	label.setFontColor("#ffffff");
	      	label.setStroke(0);
	      	this.addFigure(label, new graphiti.layout.locator.TopLocator(this));
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
    	me._super(w,h);
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
        me._super(x,y);
        return this;
    },
   
   MyInputPortLocator : graphiti.layout.locator.Locator.extend({
       init:function( ){
         this._super();
       },    
       relocate:function(index, figure){
           var w = figure.getParent().getWidth();
           var h = figure.getParent().getHeight();
           figure.setPosition(w/2+1, h*index);
       }
   }),

   MyOutputPortLocator : graphiti.layout.locator.Locator.extend({
       init:function( ){
         this._super();
       },    
       relocate:function(index, figure){
           var w = figure.getParent().getWidth();
           var h = figure.getParent().getHeight();
           
           figure.setPosition(w*(index-2), h/2);
       }
   }),
   
   mousedownHandler:function(event){
	   //this._super(event);
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
       var memento = this._super();
       memento.gLabel = this.gLabel;    
       return memento;
   },
   
   setPersistentAttributes : function(memento){
       this._super(memento);
       this.gLabel = memento.gLabel;
       
       var children = this.getChildren();
	   if(children.getSize()>1){
	   		children.get(1).setText(this.gLabel);
	   }
   }
});