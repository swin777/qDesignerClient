dojo.declare("ashDraw.command.CommandAdd", ashDraw.command.Command, {
	NAME: "ashDraw.command.CommandAdd",
	
	"-chains-": {
        constructor: "manual"
    },
    constructor: function(canvas, figure, x,y){
    	this.inherited(arguments, ["Figure added"]);
 	   this.label = "Figure added";
        this.figure = figure;
        this.canvas = canvas;
        this.x = x;
        this.y = y;
    },
	
//	constructor: function(canvas, figure, x,y) {
//    	this.init(canvas, figure, x,y);
//    },
//    
//    init: function(canvas, figure, x,y){
//       //this._super("Figure added");
//	   this.inherited(arguments, ["Figure added"]);
//	   this.label = "Figure added";
//       this.figure = figure;
//       this.canvas = canvas;
//       this.x = x;
//       this.y = y;
//    },
    
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