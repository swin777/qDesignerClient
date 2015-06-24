Ext.define('Designer.view.Viewport', {
	extend: 'Ext.container.Viewport',

	xtype : 'main',
		
	layout: 'border',
    
	requires: [
		'Designer.view.viewport.North',
		'Designer.view.viewport.Center',
		'Designer.view.viewport.West',
		'Designer.view.viewport.East'
	],
    
	items : [ {
		xtype : 'viewport.north',
		region : 'north',
		height : 75,
		margin : '5 5 5 5'
	}, {
		xtype : 'viewport.west',
		collapsible : true,
		split : true,
		region : 'west',
		width : 280,
		margin : '0 0 5 5'
	}, {
		xtype : 'viewport.center',
		region : 'center',
		margin : '0 0 5 0'
	}, {
		xtype : 'viewport.east',
		region : 'east',
		collapsible : true,
		split : true,
		width : 200,
		margin : '0 5 5 0'
	} ]
	
});