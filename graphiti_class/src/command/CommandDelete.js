graphiti.command.CommandDelete = graphiti.command.Command.extend({
	NAME: "graphiti.command.CommandDelete",

    init: function( figure){
       this._super("Figure deleted");
       this.parent   = figure.getParent();
       this.figure   = figure;
       this.canvas = figure.getCanvas();
       this.connections = null;
    },
    
    execute:function(){
       this.redo();
    },
    
    undo:function(){
        this.canvas.addFigure(this.figure);
        if(this.figure instanceof graphiti.Connection)
           this.figure.reconnect();
    
        this.canvas.setCurrentSelection(this.figure);
        if(this.parent!==null)
          this.parent.addChild(this.figure);
        for (var i = 0; i < this.connections.getSize(); ++i)
        {
           this.canvas.addFigure(this.connections.get(i));
           this.connections.get(i).reconnect();
        }
        this.groupAdminByAdd();
    },
    
    redo:function(){
    	this.groupAdminByRemove();
        this.canvas.setCurrentSelection(null);
        if(this.figure instanceof graphiti.shape.node.Node && this.connections===null)
        {
          this.connections = new graphiti.util.ArrayList();
          var ports = this.figure.getPorts();
          for(var i=0; i<ports.getSize(); i++)
          {
            var port = ports.get(i);
            // Do NOT add twice the same connection if it is linking ports from the same node
            for (var c = 0, c_size = port.getConnections().getSize() ; c< c_size ; c++)
            {
                if(!this.connections.contains(port.getConnections().get(c)))
                {
                  this.connections.add(port.getConnections().get(c));
                }
            }
          }
          for(var i=0; i<ports.getSize(); i++)
          {
            var port = ports.get(i);
            port.setCanvas(null);
          }
        }
        this.canvas.removeFigure(this.figure);
    
       if(this.connections===null)
          this.connections = new graphiti.util.ArrayList();
    
        // remove this figure from the parent 
        //
        if(this.parent!==null)
          this.parent.removeChild(this.figure);
    
       for (var i = 0; i < this.connections.getSize(); ++i)
       {
          this.canvas.removeFigure(this.connections.get(i));
       }
    }
});
