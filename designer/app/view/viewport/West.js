Ext.define('Designer.view.viewport.West', {

	extend : 'Ext.Panel',

	requires: [
		'Designer.view.Pallete',
		'Designer.view.Outline'
	],
	
	alias : 'widget.viewport.west',
	
	id : 'west',
	
	title : 'Pallete',
	
	autoScroll : true,

	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	items : [ {
		xtype : 'pallete',
		flex : 2
	}, {
		xtype : 'outline',
		flex : 1
	} ]	
});