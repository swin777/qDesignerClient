Ext.define('Designer.model.NotationNode', {
    
	extend: 'Ext.data.Model',
    
	fields: [
		{ name : 'id', type : 'string' },
		{ name : 'notation_id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'node_type', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'status', type : 'string' },
		{ name : 'cls_name', type : 'string' },
		{ name : 'rank', type : 'integer' },
		{ name : 'shape_data', type : 'string' },
		{ name : 'shape_width', type : 'integer' },
		{ name : 'shape_height', type : 'integer' },
		{ name : 'creator_id', type : 'string' },
		{ name : 'updater_id', type : 'string' },
		{ name : 'created_at', type : 'date' },
		{ name : 'updated_at', type : 'date' }
	],
	
  	proxy: {
		type: 'rest',
		url : '/notation_nodes',
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