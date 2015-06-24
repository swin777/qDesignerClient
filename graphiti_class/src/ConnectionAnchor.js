/**
Library is under GPL License (GPL)

Copyright (c) 2012 Andreas Herz

**/


graphiti.ConnectionAnchor=Class.extend({NAME:"graphiti.ConnectionAnchor",init:function(_5e3){if(typeof _5e3==="undefined"){throw "Missing parameter for 'owner' in ConnectionAnchor";}this.owner=_5e3;},getLocation:function(_5e4){return this.getReferencePoint();},getOwner:function(){return this.owner;},setOwner:function(_5e5){if(typeof _5e5==="undefined"){throw "Missing parameter for 'owner' in ConnectionAnchor.setOwner";}this.owner=_5e5;},getBox:function(){return this.getOwner().getAbsoluteBounds();},getReferencePoint:function(){return this.getOwner().getAbsolutePosition();}});