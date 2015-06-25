define(["dojo/_base/declare"], function(declare){
	var PositionConstants = declare("ashDraw.geo.PositionConstants", null, {
		
	});
	PositionConstants.NORTH =  1;
	PositionConstants.SOUTH =  4;
	PositionConstants.WEST  =  8;
	PositionConstants.EAST  = 16;
	return PositionConstants;
});