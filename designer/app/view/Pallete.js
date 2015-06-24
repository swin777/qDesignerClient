Ext.define('Designer.view.Pallete', {

	extend : 'Ext.container.Container',
	
	requires : [
		'Designer.view.notation.Basic'
	],
	
	alias : 'widget.pallete',
	
	id : 'pallete',
	
	animCollapse: true,
  
	autoScroll : true,
	
	split: true,
		
	layout : {
		type : 'accordion',
		animate : true
	},

	items : [ {
		xtype : 'basic_container'
	} ]
	
});