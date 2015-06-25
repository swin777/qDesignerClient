define(["dojo/_base/declare", "ashDraw/SVGFigure", "ashDrawEx/MyInputPortLocator", "ashDrawEx/MyOutputPortLocator"], function(declare){
	return declare("ashDrawEx.shape.node.basic.SampleFigure", ashDraw.SVGFigure, {

	    NAME:"ashDrawEx.shape.node.basic.SampleFigure",
	    SVG_STR: "",

	    "-chains-": {
	        constructor: "manual"
	    },
	    
	    constructor:function(width, height){
	        // if(typeof SVG_STR == "undefined"){
	        	 // $.ajax({
				    // url: 'http://127.0.0.1:8080/SampleFigure.jsp',
				    // type: 'POST',
				    // async: false,
				    // timeout: 36000,
				    // dataType: 'text',
				    // error:function(e){
		            	// SVG_STR =   '<svg width="50" height="50" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">' +
									// ' <g>' +
									// '  <title>Layer 1</title>' +
									// '  <rect x="1" y="1" width="49" height="49" id="svg_1" fill="#00ff00" stroke="#000000"/>' +
									// '  <polyline points="11.5,13 12.5,13 14.5,12 15.5,12 16.5,12 17.5,12 18.5,12 19.5,12 20.5,12 21.5,12 23.5,12 24.5,12 24.5,13 25.5,13 26.5,14 27.5,14 27.5,15 28.5,17 28.5,18 28.5,19 28.5,20 28.5,21 28.5,22 28.5,23 28.5,24 28.5,25 28.5,26 28.5,27 28.5,28 28.5,29 27.5,29 27.5,30 27.5,31 27.5,32 27.5,33 27.5,34 27.5,35 27.5,36 27.5,37 27.5,38 27.5,39 28.5,39 28.5,40 29.5,40 31.5,40 33.5,40 34.5,40 35.5,40 36.5,41 37.5,41 38.5,41 39.5,41 40.5,41 41.5,41 " id="svg_4" fill="none" stroke="#000000" stroke-width="null" stroke-dasharray="null" stroke-linecap="round" stroke-linejoin="round"/>' +
									// '  <polyline points="40.5,11 41.5,11 41.5,12 41.5,13 41.5,14 42.5,15 42.5,16 42.5,17 42.5,18 42.5,19 42.5,20 42.5,21 42.5,22 41.5,23 40.5,23 40.5,24 40.5,25 40.5,26 39.5,26 39.5,28 38.5,28 38.5,29 37.5,29 36.5,29 35.5,29 34.5,29 33.5,29 32.5,29 31.5,29 30.5,29 29.5,29 28.5,29 26.5,29 25.5,29 24.5,29 23.5,29 22.5,28 21.5,27 20.5,27 19.5,26 18.5,26 17.5,26 17.5,25 16.5,25 16.5,26 15.5,26 15.5,27 14.5,27 14.5,28 14.5,29 13.5,29 13.5,30 13.5,31 12.5,31 12.5,32 12.5,33 12.5,34 12.5,35 12.5,36 12.5,37 12.5,38 12.5,39 12.5,40 12.5,41 12.5,42 " id="svg_5" fill="none" stroke="#000000" stroke-width="null" stroke-dasharray="null" stroke-linecap="round" stroke-linejoin="round"/>' +
									// ' </g>' +
									// '</svg>';
		            // },
		            // success:function(obj){
		                // SVG_STR = obj;
		            // }
				// });	
	        // }
			
	        if(typeof width === "undefined"){
	            width = 50;
	            height= 50;
	        }
	        
	        this.inherited(arguments, [width, height]);
	        
	        this.inputLocator = new ashDrawEx.MyInputPortLocator();
	        this.outputLocator = new ashDrawEx.MyOutputPortLocator();
	        
	        this.createPort("hybrid",this.inputLocator);
	        this.createPort("hybrid",this.inputLocator);
	        
	        this.createPort("hybrid",this.outputLocator);
	        this.createPort("hybrid",this.outputLocator);
	    },
	    

	    getSVG: function(){
	         return '<svg width="50" height="50" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">' +
									' <g>' +
									'  <title>Layer 1</title>' +
									'  <rect x="1" y="1" width="49" height="49" id="svg_1" fill="#00ff00" stroke="#000000"/>' +
									'  <polyline points="11.5,13 12.5,13 14.5,12 15.5,12 16.5,12 17.5,12 18.5,12 19.5,12 20.5,12 21.5,12 23.5,12 24.5,12 24.5,13 25.5,13 26.5,14 27.5,14 27.5,15 28.5,17 28.5,18 28.5,19 28.5,20 28.5,21 28.5,22 28.5,23 28.5,24 28.5,25 28.5,26 28.5,27 28.5,28 28.5,29 27.5,29 27.5,30 27.5,31 27.5,32 27.5,33 27.5,34 27.5,35 27.5,36 27.5,37 27.5,38 27.5,39 28.5,39 28.5,40 29.5,40 31.5,40 33.5,40 34.5,40 35.5,40 36.5,41 37.5,41 38.5,41 39.5,41 40.5,41 41.5,41 " id="svg_4" fill="none" stroke="#000000" stroke-width="null" stroke-dasharray="null" stroke-linecap="round" stroke-linejoin="round"/>' +
									'  <polyline points="40.5,11 41.5,11 41.5,12 41.5,13 41.5,14 42.5,15 42.5,16 42.5,17 42.5,18 42.5,19 42.5,20 42.5,21 42.5,22 41.5,23 40.5,23 40.5,24 40.5,25 40.5,26 39.5,26 39.5,28 38.5,28 38.5,29 37.5,29 36.5,29 35.5,29 34.5,29 33.5,29 32.5,29 31.5,29 30.5,29 29.5,29 28.5,29 26.5,29 25.5,29 24.5,29 23.5,29 22.5,28 21.5,27 20.5,27 19.5,26 18.5,26 17.5,26 17.5,25 16.5,25 16.5,26 15.5,26 15.5,27 14.5,27 14.5,28 14.5,29 13.5,29 13.5,30 13.5,31 12.5,31 12.5,32 12.5,33 12.5,34 12.5,35 12.5,36 12.5,37 12.5,38 12.5,39 12.5,40 12.5,41 12.5,42 " id="svg_5" fill="none" stroke="#000000" stroke-width="null" stroke-dasharray="null" stroke-linecap="round" stroke-linejoin="round"/>' +
									' </g>' +
									'</svg>';
	    }
	});
});