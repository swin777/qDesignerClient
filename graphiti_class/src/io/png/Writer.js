/**
Library is under GPL License (GPL)

Copyright (c) 2012 Andreas Herz

**/




/**
 * @class graphiti.io.png.Writer
 * Convert the canvas document into a PNG Image.
 * 
 *     // example how to create a PNG image and set an 
 *     // image src attribute.
 *     //
 *     var writer = new graphiti.io.png.Writer();
 *     var png = writer.marshal(canvas);
 *     $("#preview").attr("src",png);
 *
 * @author Andreas Herz
 * @extends graphiti.io.Writer
 */
graphiti.io.png.Writer = graphiti.io.Writer.extend({
    
    init:function(){
        this._super();
    },
    
    /**
     * @method
     * Export the content to the implemented data format. Inherit class implements
     * content specific writer.
     * 
     * @param {graphiti.Canvas} canvas
     * @returns {String} base64 formated image in the format <strong><code>data:image/png;base64,iVBORw0KGg...</code></strong>
     */
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