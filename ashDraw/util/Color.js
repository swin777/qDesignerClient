dojo.declare("ashDraw.util.Color", null, {

	constructor: function( red, green, blue) {

      if(typeof green == "undefined")
      {
        var rgb = this.hex2rgb(red);
        this.red= rgb[0];
        this.green = rgb[1];
        this.blue = rgb[2];
      }
      else
      {
        this.red= red;
        this.green = green;
        this.blue = blue;
      }
    },
    
    getHTMLStyle:function(){
      return "rgb("+this.red+","+this.green+","+this.blue+")";
    },
    
    getHashStyle:function(){
      return this.hash();
    },
    
    getRed:function(){
      return this.red;
    },
    
    
    getGreen:function(){
      return this.green;
    },
    
    getBlue:function(){
      return this.blue;
    },
    
    getIdealTextColor:function(){
       var nThreshold = 105;
       var bgDelta = (this.red * 0.299) + (this.green * 0.587) + (this.blue * 0.114);
       return (255 - bgDelta < nThreshold) ? new  ashDraw.util.Color(0,0,0) : new  ashDraw.util.Color(255,255,255);
    },
    
    hex2rgb:function(/*:String */hexcolor){
      hexcolor = hexcolor.replace("#","");
      return(
             {0:parseInt(hexcolor.substr(0,2),16),
              1:parseInt(hexcolor.substr(2,2),16),
              2:parseInt(hexcolor.substr(4,2),16)}
             );
    },
    
    hex:function(){ 
      return(this.int2hex(this.red)+this.int2hex(this.green)+this.int2hex(this.blue)); 
    },
    
    
    hash:function(){
        return "#"+this.hex();
    },
    
    int2hex:function(v) {
      v=Math.round(Math.min(Math.max(0,v),255));
      return("0123456789ABCDEF".charAt((v-v%16)/16)+"0123456789ABCDEF".charAt(v%16));
    },
    
    darker:function(fraction){
       var red   = parseInt(Math.round (this.getRed()   * (1.0 - fraction)));
       var green = parseInt(Math.round (this.getGreen() * (1.0 - fraction)));
       var blue  = parseInt(Math.round (this.getBlue()  * (1.0 - fraction)));
    
       if (red   < 0) red   = 0; else if (red   > 255) red   = 255;
       if (green < 0) green = 0; else if (green > 255) green = 255;
       if (blue  < 0) blue  = 0; else if (blue  > 255) blue  = 255;
    
       return new ashDraw.util.Color(red, green, blue);
    },
    
    lighter:function( fraction){
        var red   = parseInt(Math.round (this.getRed()   * (1.0 + fraction)));
        var green = parseInt(Math.round (this.getGreen() * (1.0 + fraction)));
        var blue  = parseInt(Math.round (this.getBlue()  * (1.0 + fraction)));
    
        if (red   < 0) red   = 0; else if (red   > 255) red   = 255;
        if (green < 0) green = 0; else if (green > 255) green = 255;
        if (blue  < 0) blue  = 0; else if (blue  > 255) blue  = 255;
    
        return new ashDraw.util.Color(red, green, blue);
    }
});
