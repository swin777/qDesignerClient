

hatio.shape.node.basic.SampleFigure2 = graphiti.SVGFigure.extend({

    NAME:"hatio.shape.node.basic.SampleFigure2",
    SVG_STR: "",
   
    // custom locator for the special design of the ResistorBridge Input area
    MyInputPortLocator : graphiti.layout.locator.Locator.extend({
        init:function( ){
          this._super();
        },    
        relocate:function(index, figure){
            var w = figure.getParent().getWidth();
            var h = figure.getParent().getHeight();
            figure.setPosition(w/2+1, h*index);
        }
    }),

    // custom locator for the special design of the ResistorBridge Input area
    MyOutputPortLocator : graphiti.layout.locator.Locator.extend({
        init:function( ){
          this._super();
        },    
        relocate:function(index, figure){
            var w = figure.getParent().getWidth();
            var h = figure.getParent().getHeight();
            
            figure.setPosition(w*(index-2), h/2);
        }
    }),


    /**
     * @constructor
     * Create a new instance
     */
    init:function(width, height){
        // if(typeof SVG_STR == "undefined"){
        	 // $.ajax({
			    // url: 'http://127.0.0.1:8080/SampleFigure2.jsp',
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
        
        this._super(width,height);
        
        this.inputLocator = new this.MyInputPortLocator();
        this.outputLocator = new this.MyOutputPortLocator();
        
        this.createPort("hybrid",this.inputLocator);
        this.createPort("hybrid",this.inputLocator);
        
        this.createPort("hybrid",this.outputLocator);
        this.createPort("hybrid",this.outputLocator);
    },
    

    getSVG: function(){
         return '<svg  xmlns="http://www.w3.org/2000/svg" version="1.1"><image xlink:href="data:image/png;base64,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" height="50" width="50"/></svg>';
    }
});