/**
Library is under GPL License (GPL)

Copyright (c) 2012 Andreas Herz

**/


/**
 * @class graphiti.decoration.connection.CircleDecorator
 * 
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
 *     c.setSourceDecorator(new graphiti.decoration.connection.CircleDecorator());
 *     c.setTargetDecorator(new graphiti.decoration.connection.CircleDecorator());   
 *     // Connect the endpoints with the start and end port
 *     //
 *     c.setSource(start.getOutputPort(0));
 *     c.setTarget(end.getInputPort(0));
 *           
 *     // and finally add the connection to the canvas
 *     canvas.addFigure(c);
 * 
 * @inheritable
 * @author Andreas Herz
 * @extend graphiti.decoration.connection.Decorator
 */
graphiti.decoration.connection.CircleDecorator = graphiti.decoration.connection.Decorator.extend({

	NAME : "graphiti.decoration.connection.CircleDecorator",

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
	 * Draw a filled circle decoration.

	 * @param {Raphael} paper the raphael paper object for the paint operation 
	 **/
	paint:function(paper)
	{
		var shape= paper.circle(0, 0, this.width/2);
        shape.attr({fill:this.backgroundColor.hash()});
		
		return shape;
	}
});






