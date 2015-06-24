dojo.declare("ashDraw.geo.Rectangle", ashDraw.geo.Point, {
    NAME : "ashDraw.geo.Rectangle",
    
    "-chains-": {
        constructor: "manual"
    },
    constructor: function(x, y,  w, h) {
    	this.inherited(arguments, [x, y]);
        this.w = w;
        this.h = h;
    },

    adjustBoundary:function(){
        if(this.bx===null){
            return;
        }
        this.x = Math.min(Math.max(this.bx, this.x), this.bw-this.w);
        this.y = Math.min(Math.max(this.by, this.y), this.bh-this.h);
        this.w = Math.min(this.w, this.bw);
        this.h = Math.min(this.h, this.bh);
    },
    
	resize:function(/*:int*/ dw, /*:int*/ dh){
	  this.w +=dw;
	  this.h +=dh;
      this.adjustBoundary();
	  return this;
	},
	
	setBounds:function( rect){
	    this.setPosition(rect.x,rect.y);

	    this.w = rect.w;
	    this.h = rect.h;
	    
  	   return this;
	},
	
	isEmpty:function(){
	  return this.w <= 0 || this.h <= 0;
	},
	
	getWidth:function(){
	  return this.w;
	},
	
	setWidth: function(w){
      this.w = w;
      this.adjustBoundary();
      return this;
	},
	
	getHeight:function(){
	  return this.h;
	},
   
    setHeight: function(h){
      this.h = h;
      this.adjustBoundary();
      return this;
    },	
    
    getLeft:function(){
      return this.x;
    },
   
	getRight:function(){
	  return this.x+this.w;
	},
	
    getTop:function(){
      return this.y;
    },
    
	getBottom:function(){
	  return this.y+this.h;
	},
	
	getTopLeft:function(){
	  return new ashDraw.geo.Point(this.x,this.y);
	},
	
    getTopCenter:function(){
      return new ashDraw.geo.Point(this.x+(this.w/2),this.y);
    },

	getTopRight:function(){
	  return new ashDraw.geo.Point(this.x+this.w,this.y);
	},
		
	getBottomLeft:function(){
	  return new ashDraw.geo.Point(this.x,this.y+this.h);
	},
	
    getBottomCenter:function(){
      return new ashDraw.geo.Point(this.x+(this.w/2),this.y+this.h);
    },
   
	getCenter:function(){
	  return new ashDraw.geo.Point(this.x+this.w/2,this.y+this.h/2);
	},
	
	getBottomRight:function(){
	  return new ashDraw.geo.Point(this.x+this.w,this.y+this.h);
	},
	
	moveInside: function(rect){
	    var newRect = new ashDraw.geo.Rectangle(rect.x,rect.y,rect.w,rect.h);
	    // shift the coordinate right/down if coordinate not inside the rect
	    //
	    newRect.x= Math.max(newRect.x,this.x);
	    newRect.y= Math.max(newRect.y,this.y);
	    
	    // ensure that the right border is inside this rect (if possible). 
	    //
	    if(newRect.w<this.w){
	        newRect.x = Math.min(newRect.x+newRect.w, this.x+this.w)-newRect.w; 
	    }
	    else{
	        newRect.x = this.x;
	    }
	    
	    // ensure that the bottom is inside this rectangle
	    //
        if(newRect.h<this.h){
            newRect.y = Math.min(newRect.y+newRect.h, this.y+this.h)-newRect.h; 
        }
        else{
            newRect.y = this.y;
        }

        return newRect;
	},
	
	getDistance: function (pointOrRectangle){
		var cx = this.x;
		var cy = this.y;
		var cw = this.w;
		var ch = this.h;
		
		var ox = pointOrRectangle.getX();
		var oy = pointOrRectangle.getY();
		var ow = 1;
		var oh = 1;
		
		if(pointOrRectangle instanceof ashDraw.geo.Rectangle){
			ow = pointOrRectangle.getWidth();
			oh = pointOrRectangle.getHeight();
		}
		var oct=9;

		// Determin Octant
		//
		// 0 | 1 | 2
		// __|___|__
		// 7 | 9 | 3
		// __|___|__
		// 6 | 5 | 4

		if(cx + cw <= ox){
			if((cy + ch) <= oy){
				oct = 0;
			}
			else if(cy >= (oy + oh)){
				oct = 6;
			}
			else{
				oct = 7;
			}
	    }
		else if(cx >= ox + ow){
			if(cy + ch <= oy){
				oct = 2;
			}
			else if(cy >= oy + oh){
				oct = 4;
			}
			else{
				oct = 3;
			}
		}
		else if(cy + ch <= oy){
			oct = 1;
		}
		else if(cy >= oy + oh){
			oct = 5;
		}
		else{
			return 0;
		}


		// Determin Distance based on Quad
		//
		switch( oct){
			case 0:
				cx = (cx + cw) - ox;
				cy = (cy + ch) - oy;
				return -(cx + cy) ;
			case 1:
				return -((cy + ch) - oy);
			case 2:
				cx = (ox + ow) - cx;
				cy = (cy + ch) - oy;
				return -(cx + cy);
			case 3:
				return -((ox + ow) - cx);
			case 4:
				cx = (ox + ow) - cx;
				cy = (oy + oh) - cy;
				return -(cx + cy);
			case 5:
				return -((oy + oh) - cy);
			case 6:
				cx = (cx + cw) - ox;
				cy = (oy + oh) - cy;
				return -(cx + cy);
			case 7:
				return -((cx + cw) - ox);
		}

		throw "Unknown data type of parameter for distance calculation in ashDraw.geo.Rectangle.getDistnace(..)";
	},
	
    determineOctant: function( r2){
        var ox = this.x;
        var oy = this.y;
        var ow = this.w;
        var oh = this.h;
        
        var cx = r2.x;
        var cy = r2.y;
        var cw = r2.w;
        var ch = r2.h;
        var oct =0;

        if(cx + cw <= ox){
            if((cy + ch) <= oy){
                oct = 0;
            }
            else if(cy >= (oy + oh)){
                oct = 6;
            }
            else{
                oct = 7;
            }
        }
        else if(cx >= ox + ow){
            if(cy + ch <= oy){
                oct = 2;
            }
            else if(cy >= oy + oh){
                oct = 4;
            }
            else{
                oct = 3;
            }
        }
        else if(cy + ch <= oy){
            oct = 1;
        }
        else if(cy >= oy + oh){
            oct = 5;
        }
        else{
            oct= 8;
        }
        
        return oct;
    },
  
	equals:function( o){
	  return this.x==o.x && this.y==o.y && this.w==o.w && this.h==o.h;
	},
	
    hitTest : function ( iX , iY){
        var iX2 = this.x + this.getWidth();
        var iY2 = this.y + this.getHeight();
        return (iX >= this.x && iX <= iX2 && iY >= this.y && iY <= iY2);
    },
    
    toJSON : function(){
        return  { 
              width:this.w,
              height:this.h,
              x : this.x,
              y :this.y
          };
      }
});
