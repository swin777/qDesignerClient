dojo.declare("ashDraw.command.CommandReconnect", ashDraw.command.Command, {
    NAME : "ashDraw.command.CommandReconnect", 

    "-chains-": {
        constructor: "manual"
    },
    constructor : function(con){
        this.con      = con;
        this.oldSourcePort  = con.getSource();
        this.oldTargetPort  = con.getTarget();
        this.oldRouter      = con.getRouter();
     },
    
//    constructor: function(con) {
//    	this.init(con);
//    },
//    
//    init : function(con){
//       this.con      = con;
//       this.oldSourcePort  = con.getSource();
//       this.oldTargetPort  = con.getTarget();
//       this.oldRouter      = con.getRouter();
//    },
    
    
    canExecute:function(){
      return true;
    },
    
    setNewPorts:function(source,  target){
      this.newSourcePort = source;
      this.newTargetPort = target;
    },
    
    execute:function(){
       this.redo();
    },
    
    cancel:function(){
//      var start  = this.con.sourceAnchor.getConnectionAnchorLocation(this.con.targetAnchor.getReferencePoint());
//      var end    = this.con.targetAnchor.getConnectionAnchorLocation(this.con.sourceAnchor.getReferencePoint());
//      this.con.setStartPoint(start.x,start.y);
//       this.con.setEndPoint(end.x,end.y);
    	this.con.calculatePath();
       this.con.setRouter(this.oldRouter);
       this.con.getCanvas().showLineResizeHandles(this.con);
    },
    
    undo:function(){
      this.con.setSource(this.oldSourcePort);
      this.con.setTarget(this.oldTargetPort);
      this.con.setRouter(this.oldRouter);
      if(this.con.getCanvas().getCurrentSelection()==this.con)
         this.con.getCanvas().showLineResizeHandles(this.con);
    },
    
    redo:function(){
      this.con.setSource(this.newSourcePort);
      this.con.setTarget(this.newTargetPort);
      this.con.setRouter(this.oldRouter);
      if(this.con.getCanvas().getCurrentSelection()==this.con)
         this.con.getCanvas().showLineResizeHandles(this.con);
    }
});