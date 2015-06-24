Ext.define('Designer.model.Directory', {

	extend: 'Ext.data.Model',

	fields: [
		{ name : 'id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'parent_id', type : 'string' },
		{ name : 'leaf', type : 'boolean' },
		{ name : 'expanded', type : 'boolean' },
		{ name : 'children', type : 'auto' }
	],

	proxy: {
		type: 'rest',
		url : '/directories',
		format : 'json',
		reader: {
			type: 'json',
			root: 'items',
			successProperty : 'success',
			totalProperty : 'total'
		},
		writer: {
			type: 'json'
		}
	}
});