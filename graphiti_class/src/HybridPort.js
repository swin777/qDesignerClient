/**
Library is under GPL License (GPL)

Copyright (c) 2012 Andreas Herz

**/


/**
 * @class graphiti.HybridPort
 * A HybridPort can work as Input and as Output port in the same way for a {@link graphiti.Connection}.
 * 
 * @author Andreas Herz
 * @extends graphiti.Port
 */ 
graphiti.HybridPort = graphiti.Port.extend({

    NAME : "graphiti.HybridPort",

    /**
     * @constructor
     * Create a new HybridPort element
     * 
     * @param {String} [name] the name for the Port.
     */
    init : function(name)
    {
        this._super(name);

        // responsive for the arrangement of the port 
        // calculates the x/y coordinates in relation to the parent node
        this.locator=new graphiti.layout.locator.InputPortLocator();
    },

    
    /**
     * @inheritdoc
     * 
     * @param {graphiti.Figure} figure The figure which is currently dragging
     * @return {graphiti.Figure} the figure which should receive the drop event or null if the element didnt want a drop event
     */
    onDragEnter : function(figure)
    {
    	// Accept any kind of port
        if (figure instanceof graphiti.Port) {
            return this._super(figure);
        }
        
        return null;
    },
    
    /**
     * @inheritdoc
     * 
     */
    onDragLeave:function( figure)
    {
	  // Ports accepts only Ports as DropTarget
	  //
	  if(!(figure instanceof graphiti.Port)){
		 return;
	  }

	  // accept any kind of port
      if(figure instanceof graphiti.Port){
        this._super( figure);
      }
      
    },

    /**
     * @inheritdoc
     *
     * @param {graphiti.command.CommandType} request describes the Command being requested
     * @return {graphiti.command.Command} null or a valid command
     **/
    createCommand:function(request)
    {
       // Connect request between two ports
       //
       if(request.getPolicy() === graphiti.command.CommandType.CONNECT) {
         if(request.source.getParent()==null || request.source.getParent()==null){
         	return null;
         }
         if(request.source.getParent().getId() === request.target.getParent().getId()){
            return null;
         }    

         if (request.source instanceof graphiti.InputPort) {
            // This is the difference to the InputPort implementation of createCommand.
            return new graphiti.command.CommandConnect(request.canvas, request.target, request.source);
         }
         else if (request.source instanceof graphiti.OutputPort) {
            // This is the different to the OutputPort implementation of createCommand
            return new graphiti.command.CommandConnect(request.canvas, request.source, request.target);
         }
         else if (request.source instanceof graphiti.HybridPort) {
            // This is the different to the OutputPort implementation of createCommand
            //return new graphiti.command.CommandConnect(request.canvas, request.source, request.target);
            var connCommand = new graphiti.command.CommandConnect(request.canvas, request.target, request.source);
            var conn = new graphiti.Connection(this.canvas.connectType);
            conn.setTargetDecorator(new graphiti.decoration.connection.ArrowDecorator());
            connCommand.setConnection(conn);
            return connCommand;
         }
         
         return null;
       }
    
       // ...else call the base class
       return this._super(request);
    }
});