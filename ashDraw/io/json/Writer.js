define(["dojo/_base/declare", "ashDraw/io/Writer"], function(declare){
	return declare("ashDraw.io.json.Writer", ashDraw.io.Writer, {
		"-chains-": {
	        constructor: "manual"
	    },
		constructor: function() {
			this.inherited(arguments);
	    },
	    
	    marshal: function(canvas){
	        var result = [];
	        var figures = canvas.getFigures();
	        var i =0;
	        var f= null;
	        
	        for(i=0; i< figures.getSize(); i++){
	            f = figures.get(i);
	            result.push(f.getPersistentAttributes());
	        }
	        
	        var lines = canvas.getLines();
	        lines.each(function(i, element){
	            result.push(element.getPersistentAttributes());
	        });
	        return result;
	    }
	});
});