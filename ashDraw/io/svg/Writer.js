define(["dojo/_base/declare", "ashDraw/io/Writer"], function(declare){
	return declare("ashDraw.io.svg.Writer", ashDraw.io.Writer, {
	    
		"-chains-": {
	        constructor: "manual"
	    },
		
	    constructor: function(){
	    	this.inherited(arguments);
	    },
	    
	    marshal: function(canvas){
	        var s =canvas.getCurrentSelection();
	        canvas.setCurrentSelection(null);
	        var svg = canvas.getHtmlContainer().html()
	                     .replace(/>\s+/g, ">")
	                     .replace(/\s+</g, "<");
	        svg = this.formatXml(svg);
	        svg = svg.replace(/<desc>.*<\/desc>/g,"<desc>Create with ashDraw JS graph library and RaphaelJS</desc>");
	        
	        canvas.setCurrentSelection(s);
	        return svg;
	    }
	});
});