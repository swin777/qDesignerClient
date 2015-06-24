dojo.declare("ashDraw.layout.connection.ConnectionRouter", null, {
    NAME : "ashDraw.layout.connection.ConnectionRouter",

    constructor: function(){
    },
    
    getDirection:function( r,  p) 
    {
        //  up     -> 0
        //  right  -> 1
        //  down   -> 2
        //  left   -> 3
       var distance = Math.abs(r.x - p.x);
       var direction = 3;
    
       var i=Math.abs(r.y - p.y);
       if (i <= distance) 
       {
          distance = i;
          direction = 0;
       }
    
       i = Math.abs(r.getBottom() - p.y);
       if (i <= distance) 
       {
          distance = i;
          direction = 2;
       }
    
       i = Math.abs(r.getRight() - p.x);
       if (i < distance) 
       {
          distance = i;
          direction = 1;
       }
    
       return direction;
    },
    
    getEndDirection:function( conn)
    {
       var p = conn.getEndPoint();
       var rect = conn.getTarget().getParent().getBoundingBox();
       
       return this.getDirection(rect, p);
    },
    
    getStartDirection:function( conn)
    {
       var p = conn.getStartPoint();
       var rect = conn.getSource().getParent().getBoundingBox();
       return this.getDirection(rect, p);
    },
    
    route:function( connection)
    {
    	throw "subclasses must implement the method [ConnectionRouter.route]";
    }   
});