Ext.define('Designer.view.viewport.North', {
	extend : 'Ext.Panel',

	alias : 'widget.viewport.north',
	
	id : 'north',
	
	requires: [
		'Designer.view.Menu',
		'Designer.view.QuickMenu'		
	],
		
	tbar : {
		xtype : 'mainmenu'
	},

	layout : {
		type : 'hbox',
		align : 'stretch'
	},

	items : [ {
		xtype : 'quickmenu'
	} ]
});
