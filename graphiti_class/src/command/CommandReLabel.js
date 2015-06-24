
graphiti.command.CommandReLabel = graphiti.command.Command.extend({
    NAME : "graphiti.command.CommandReLabel", 
  
    
    init : function(figure, label){
        this._super("Figure moved");
        this.figure = figure;
        if (typeof label === "undefined"){
            this.oldLabel = figure.getLabel();
        }
        else{
            this.oldLabel = label;
        }
   },
    
   
    setLabel:function(label){
       this.newLabel = label;
    },

   
    canExecute:function(){
      return this.newLabel!=this.oldLabel;
    },
    
   
    execute:function(){
       this.redo();
    },
    
    
    undo:function(){
    	if(this.figure instanceof hatio.shape.node.basic.Group){
    		var children = this.figure.getChildren();
    		if(children.getSize()>1){
        		children.get(1).setText(this.oldLabel);
        		this.figure.gLabel = this.oldLabel;
        	}
    	}else{
    		this.figure.setLabel(this.oldLabel);
    	}
    },
    
    redo:function(){
    	if(this.figure instanceof hatio.shape.node.basic.Group){
    		var children = this.figure.getChildren();
    		if(children.getSize()>1){
        		children.get(1).setText(this.newLabel);
        		this.figure.gLabel = this.newLabel;
        	}
    	}else{
    		this.figure.setLabel(this.newLabel);
    	}
    }
});