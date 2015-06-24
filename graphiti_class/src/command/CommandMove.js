graphiti.command.CommandMove = graphiti.command.Command.extend({
    NAME : "graphiti.command.CommandMove", 

    init : function(figure, x, y){
        this._super("Figure moved");
        this.figure = figure;
        if (typeof x === "undefined")
        {
            this.oldX = figure.getX();
            this.oldY = figure.getY();
        }
        else
        {
            this.oldX = x;
            this.oldY = y;
        }
   },
    

    setStartPosition:function( x,  y){
       this.oldX = x;
       this.oldY = y;
    },
    

    setPosition:function( x,  y){
       this.newX = x;
       this.newY = y;
    },

    canExecute:function(){
      // return false if we doesn't modify the model => NOP Command
      return this.newX!=this.oldX || this.newY!=this.oldY;
    },
    
    execute:function(){
       this.redo();
    },
    
    undo:function(){
       this.figure.setPosition(this.oldX, this.oldY);
       this.groupAdminByMove();
    },
    
    redo:function(){
       this.figure.setPosition(this.newX, this.newY);
       this.groupAdminByMove();
    }
});