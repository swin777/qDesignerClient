Ext.define('Designer.view.notation.Basic', {

	extend : 'Ext.panel.Panel',
	
	alias : 'widget.basic_container',
	
	id : 'basic_container',
	
	title : 'Basic',
	
	layout : {
		type: 'vbox',
		align : 'stretch'
	},
		
	items : [ {
		xtype : 'container',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'notation_node',
			id : 'basic_start',
			nodeInfo : {id : 'basic_start', name : 'Start', cls_name : 'ashDraw.shape.node.Start', node_type : 'Node'}
		}, 	{
			xtype : 'notation_node',
			id : 'basic_end',
			nodeInfo : {id : 'basic_end', name : 'End', cls_name : 'ashDraw.shape.node.End', node_type : 'Node'}
		}, 	{
			xtype : 'notation_node',
			id : 'basic_rectangle',
			nodeInfo : {id : 'basic_rectangle', name : 'Rectangle', cls_name : 'ashDrawEx.shape.node.basic.Rectangle', node_type : 'Node'}
		} ]
	}, {
		xtype : 'container',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'notation_node',
			id : 'basic_circle',
			nodeInfo : {id : 'basic_circle', name : 'Circle', cls_name : 'ashDrawEx.shape.node.basic.Circle', node_type : 'Node'}
		}, 	{
			xtype : 'notation_node',
			id : 'basic_oval',
			nodeInfo : {id : 'basic_oval', name : 'Oval', cls_name : 'ashDrawEx.shape.node.basic.Oval', node_type : 'Node'}
		}, 	{
			xtype : 'notation_node',
			id : 'basic_diamond',
			nodeInfo : {id : 'basic_diamond', name : 'Diamond', cls_name : 'ashDrawEx.shape.node.basic.Diamond', node_type : 'Node'}
		} ]
	}, {
		xtype : 'container',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'notation_node',
			id : 'basic_label',
			nodeInfo : {id : 'basic_label', name : 'Label', cls_name : 'ashDrawEx.shape.node.basic.Label', node_type : 'Node'}
		}, 	{
			xtype : 'notation_node',
			id : 'basic_image',
			nodeInfo : {id : 'basic_image', name : 'Image', cls_name : 'ashDrawEx.shape.node.basic.Image', node_type : 'Node'}
 		}, 	{
			xtype : 'notation_node',
			id : 'basic_group',
			nodeInfo : {id : 'basic_group', name : 'Group', cls_name : 'ashDrawEx.shape.node.basic.Group', node_type : 'Node'}
 		}  ]
	} ]
});