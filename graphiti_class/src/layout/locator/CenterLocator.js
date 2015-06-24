/**
Library is under GPL License (GPL)

Copyright (c) 2012 Andreas Herz

**/



/**
 * @class graphiti.layout.locator.CenterLocator
 * 
 * A CenterLocator is used to place figures in the center of a parent shape.
 *
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *
 *     // create a basic figure and add a Label/child via API call
 *     //
 *     var circle = new graphiti.shape.basic.Circle(120);
 *     circle.setStroke(3);
 *     circle.setColor("#A63343");
 *     circle.setBackgroundColor("#E65159");
 *     circle.addFigure(new graphiti.shape.basic.Label("Center Label"), new graphiti.layout.locator.CenterLocator(circle));	
 *     canvas.addFigure( circle, 100,50);
 *
 *     
 * @author Andreas Herz
 * @extend graphiti.layout.locator.Locator
 */
graphiti.layout.locator.CenterLocator= graphiti.layout.locator.Locator.extend({
    NAME : "graphiti.layout.locator.CenterLocator",
    
    /**
     * @constructor
     * Constructs a locator with associated parent.
     * 
     * @param {graphiti.Figure} parent the parent associated with the locator
     */
    init: function(parent)
    {
      this._super(parent);
    },
    
    
    /**
     * @method
     * Relocates the given Figure.
     *
     * @param {Number} index child index of the target
     * @param {graphiti.Figure} target The figure to relocate
     **/
    relocate:function(index, target)
    {
       var parent = this.getParent();
       var boundingBox = parent.getBoundingBox();

       // TODO: instanceof is always a HACK. ugly. Redirect the call to the figure instead of 
       // determine the position with a miracle.
       //
       if(target instanceof graphiti.shape.basic.Circle){
           target.setPosition(boundingBox.w/2,boundingBox.h/2);
       }
       else{
           var targetBoundingBox = target.getBoundingBox();
           target.setPosition(boundingBox.w/2-targetBoundingBox.w/2,boundingBox.h/2-(targetBoundingBox.h/2));
       }
    }
});
