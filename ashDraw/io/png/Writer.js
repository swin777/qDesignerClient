define(["dojo/_base/declare", "ashDraw/io/Writer"], function(declare){
	return declare("ashDraw.io.png.Writer", ashDraw.io.Writer, {
		"-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor: function(){
	    	this.inherited(arguments);
	    },
	    
	    marshal: function(canvas){
	        var svg = canvas.getHtmlContainer().html().replace(/>\s+/g, ">").replace(/\s+</g, "<");
			
	        var canvasDomNode = $('<canvas id="canvas" width="1000px" height="600px"></canvas>');
	        $('body').append(canvasDomNode);
	        canvg('canvas', svg, { ignoreMouse: true, ignoreAnimation: true});

	        var img = document.getElementById('canvas').toDataURL("image/png");
	        canvasDomNode.remove();
	        return img;
	    },
	    
	    marshal2: function(canvas, canvasTag){
	        var svg = canvas.getHtmlContainer().html().replace(/>\s+/g, ">").replace(/\s+</g, "<");
			svg = svg.substring(0,4) + ' ' + ' xmlns:xlink="http://www.w3.org/1999/xlink" ' + svg.substring(5);
	        canvg(canvasTag, svg, { ignoreMouse: true, ignoreAnimation: true});
	    }
	});
});