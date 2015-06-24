Ext.define('Designer.view.viewport.East', {

	extend : 'Ext.Panel',
	
	requires : 'Designer.view.editor.ShapePropertyEditor',

	alias : 'widget.viewport.east',
	
	id : 'east',
		
	title : 'East',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	items : [ {
		xtype : 'shape_property_editor'
	} ]
});