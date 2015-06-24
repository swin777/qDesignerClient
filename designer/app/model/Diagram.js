Ext.define('Designer.model.Diagram', {
    
	extend: 'Ext.data.Model',
    
	fields: [
		{ name : 'id', type : 'string' }, 
		{ name : 'diagram_definition_id', type : 'string' }, 
		{ name : 'version', type : 'integer' }, 
		{ name : 'status', type : 'string' }, 
		{ name : 'image_data', type : 'string' }, 
		{ name : 'content', type : 'text' }, 
		{ name : 'creator_id', type : 'string' }, 
		{ name : 'updater_id', type : 'string' }, 
		{ name : 'created_at', type : 'date' }, 
		{ name : 'updated_at', type : 'date' }, 
	],
	
  	proxy: {
		type: 'rest',
		url : '/diagrams',
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