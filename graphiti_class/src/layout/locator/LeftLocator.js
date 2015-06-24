/**
Library is under GPL License (GPL)

Copyright (c) 2012 Andreas Herz

**/



/**
 * @class graphiti.layout.locator.LeftLocator
 * 
 * A LeftLocator is used to place figures to the left of a parent shape.
 *
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *
 *     // create a basic figure and add a Label/child via API call
 *     //
 *     var start = new graphiti.shape.node.Start();
 *     start.addFigure(new graphiti.shape.basic.Label("Left Label"), new graphiti.layout.locator.LeftLocator(start));	
 *     canvas.addFigure( start, 100,50);
 *
 *     
 * @author Andreas Herz
 * @extend graphiti.layout.locator.Locator
 */
graphiti.layout.locator.LeftLocator= graphiti.layout.locator.Locator.extend({
    NAME : "graphiti.layout.locator.LeftLocator",
    
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

       var targetBoundingBox = target.getBoundingBox();
       target.setPosition(-targetBoundingBox.w-5,(boundingBox.h/2)-(targetBoundingBox.h/2));
    }
});
