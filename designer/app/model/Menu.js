Ext.define('Designer.model.Menu', {
    
	extend: 'Ext.data.Model',
    
	fields: ['id', 'parent_id', 'name', 'command', 'main_icon', 'quick_menu', 'quick_icon'],
    
	proxy: {
		type: 'ajax',
		url: '/dynagram/designer/data/menus.json',
		reader: {
			type: 'json',
			root: 'results'
		}
	}
});