/**
Library is under GPL License (GPL)

Copyright (c) 2012 Andreas Herz

**/


/**
 * @class graphiti.decoration.connection.DiamondDecorator
 * See the example:
 *
 *     @example preview small frame
 *     
 *     // create and add two nodes which contains Ports (In and OUT)
 *     //
 *     var start = new graphiti.shape.node.Start();
 *     var end   = new graphiti.shape.node.End();
        
 *     // ...add it to the canvas 
 *     canvas.addFigure( start, 50,50);
 *     canvas.addFigure( end, 230,80);
 *          
 *     // Create a Connection and connect the Start and End node
 *     //
 *     var c = new graphiti.Connection();
 *     
 *     // toggle from ManhattenRouter to DirectRouter to show the rotation of decorations
 *     c.setRouter(new graphiti.layout.connection.DirectRouter());
 *      
 *     // Set the endpoint decorations for the connection
 *     //
 *     c.setSourceDecorator(new graphiti.decoration.connection.DiamondDecorator());
 *     c.setTargetDecorator(new graphiti.decoration.connection.DiamondDecorator());   
 *     // Connect the endpoints with the start and end port
 *     //
 *     c.setSource(start.getOutputPort(0));
 *     c.setTarget(end.getInputPort(0));
 *           
 *     // and finally add the connection to the canvas
 *     canvas.addFigure(c);
 * 
 * 
 * @inheritable
 * @author Andreas Herz
 * @extend graphiti.decoration.connection.Decorator
 */
graphiti.decoration.connection.DiamondDecorator = graphiti.decoration.connection.Decorator.extend({

	NAME : "graphiti.decoration.connection.DiamondDecorator",

	/**
	 * @constructor 
	 * 
	 * @param {Number} [width] the width of the arrow
	 * @param {Number} [height] the height of the arrow
	 */
	init : function(width, height)
	{	
        this._super( width, height);
	},

	/**
	 * Draw a filled diamond decoration.
	 * 
	 * It's not your work to rotate the arrow. The graphiti do this job for you.
	 * 
	 * @param {Raphael} paper the raphael paper object for the paint operation 
	 **/
	paint:function(paper)
	{
		var st = paper.set();
		var path = ["M", this.width/2," " , -this.height/2];  // Go to the top center..
		path.push(  "L", this.width  , " ", 0);               // ...draw line to the right middle
		path.push(  "L", this.width/2, " ", this.height/2);   // ...bottom center...
		path.push(  "L", 0           , " ", 0);               // ...left middle...
		path.push(  "L", this.width/2, " ", -this.height/2);  // and close the path
		path.push(  "Z");
		st.push(
	        paper.path(path.join(""))
		);
		st.attr({fill:this.backgroundColor.hash()});
		return st;
	}
	
});
