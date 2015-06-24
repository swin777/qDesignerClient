
graphiti.command.CommandResize = graphiti.command.Command.extend({
    NAME : "graphiti.command.CommandResize", 

    init : function(figure, width, height){
        this._super("Resize Figure");
        this.figure = figure;
        
        if (typeof width === "undefined")
        {
            this.oldWidth = figure.getWidth();
            this.oldHeight = figure.getHeight();
        }
        else
        {
            this.oldWidth = width;
            this.oldHeight = height;
        }
    },
  
    setDimension:function( width, height){
       this.newWidth  = parseInt(width);
       this.newHeight = parseInt(height);
    },

    canExecute:function(){
      // return false if we doesn't modify the model => NOP Command
      return this.newWidth!=this.oldWidth || this.newHeight!=this.oldHeight;
    },
    
    execute:function(){
       this.redo();
    },
    
    undo:function(){
       this.figure.setDimension(this.oldWidth, this.oldHeight);
       this.groupAdminByResize();
    },
    
    redo:function(){
       this.figure.setDimension(this.newWidth, this.newHeight);
       this.groupAdminByResize();
    }
});