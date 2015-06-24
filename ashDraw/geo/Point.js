dojo.declare("ashDraw.geo.Point", null, {
    NAME : "ashDraw.geo.Point",
    
    constructor : function(x, y){
        this.x = parseInt(x);
        this.y = parseInt(y);

        // limit for the maxi/minimum boundary of this rectangle
        // It is not possible that the rect leave the boundary if set.
        this.bx = null;
        this.by = null;
        this.bw = null;
        this.bh = null;
    },

    setBoundary:function(bx, by, bw, bh){
        if(bx instanceof ashDraw.geo.Rectangle){
            this.bx = bx.x;
            this.by = bx.y;
            this.bw = bx.w;
            this.bh = bx.h;
        }else
        {
            this.bx = bx;
            this.by = by;
            this.bw = bw;
            this.bh = bh;
        }
        this.adjustBoundary();
    },
    
    adjustBoundary:function(){
        if(this.bx===null){
            return;
        }
        this.x = Math.min(Math.max(this.bx, this.x), this.bw);
        this.y = Math.min(Math.max(this.by, this.y), this.bh);
    },
    
    translate:function( dx,  dy){
      this.x +=dx;
      this.y +=dy;
      this.adjustBoundary();
      return this;
    },
        
    getX : function(){
        return this.x;
    },

    getY : function(){
        return this.y;
    },

    setX : function(x){
        this.x = x;
        this.adjustBoundary();
    },

    setY : function(y){
        this.y = y;
        this.adjustBoundary();
    },

    setPosition:function(x,y){
    	if(x instanceof ashDraw.geo.Point){
     	   this.x=x.x;
    	   this.y=x.y;
    	}
    	else{
    	   this.x=x;
    	   this.y=y;
    	}
        this.adjustBoundary();
    },
    
    getPosition : function(p){
        var dx = p.x - this.x;
        var dy = p.y - this.y;
        if (Math.abs(dx) > Math.abs(dy))
        {
            if (dx < 0)
                return ashDraw.geo.PositionConstants.WEST;
            return ashDraw.geo.PositionConstants.EAST;
        }
        if (dy < 0)
            return ashDraw.geo.PositionConstants.NORTH;
        return ashDraw.geo.PositionConstants.SOUTH;
    },

    equals : function(p){
        return this.x === p.x && this.y === p.y;
    },

    getDistance : function(other){
        return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
    },

    getTranslated : function(other){
        return new ashDraw.geo.Point(this.x + other.x, this.y + other.y);
    },

    getPersistentAttributes : function(){
        return {
            x : this.x,
            y : this.y
        };
    },
    
    setPersistentAttributes : function(memento){
        this.x    = memento.x;
        this.y    = memento.y;
    },
    
    clone : function(){
       return new ashDraw.geo.Point(this.x,this.y);
    }
});