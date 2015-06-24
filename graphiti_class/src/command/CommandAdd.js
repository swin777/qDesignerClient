graphiti.command.CommandAdd = graphiti.command.Command.extend({
	NAME: "graphiti.command.CommandAdd",
	
    init: function(canvas, figure, x,y){
       this._super("Figure added");
       this.figure = figure;
       this.canvas = canvas;
       this.x = x;
       this.y = y;
    },
    
    execute:function(){
       this.canvas.addFigure(this.figure, this.x, this.y);
       this.groupAdminByAdd();
    },
    
    redo:function(){
        this.execute();
    },
   
    undo:function(){
    	this.groupAdminByRemove();
        this.canvas.removeFigure(this.figure);
    }
});