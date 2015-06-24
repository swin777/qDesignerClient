Ext.define('Designer.view.popup.SelectorPopup', {
	
	extend : 'Ext.window.Window',

	alias : 'widget.selector_popup',
	
	title : 'Select Diagram',
	
	modal : true,

	width : 600,
	
	height : 360,
	
	selectedId : -1,
	
	dataList : [],
	
	initComponent : function() {
		var store = Ext.create('Ext.data.JsonStore', {
		    fields: ['id', 'title', 'updated_at', 'content'],
			data : this.dataList });
			
		this.items = [ {
			xtype : 'gridpanel',
			itemId : 'open_grid',
			store :  store,
			flex : 1,
			selModel : new Ext.selection.CheckboxModel({mode : 'SINGLE'}),
			columns : [ {
				dataIndex : 'id',
				text : 'Id'
			}, {
				dataIndex : 'title',
				text : 'Title'
			}, {
				dataIndex : 'updated_at',
				text : 'Updated At'
			}, {
				dataIndex : 'content',
				hidden : true
			} ]			
		} ];
		this.callParent(arguments);		
	},
	
	buttons : [ {
		text : T('button.close'),
		itemId : 'close',
		handler : function() {
			this.up('selector_popup').close();
		}
	} ],
	
	showPopup : function(callback) {
		this.show();
		var self = this;
		this.down('gridpanel').on('itemdblclick', function(view, record, item, index, e, eOpts) {
			Ext.callback(callback, this, [record]);
			self.close();
		});
	}
});