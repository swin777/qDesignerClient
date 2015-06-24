Ext.define('Designer.model.DiagramDefinition', {
    
	extend: 'Ext.data.Model',
    
	fields: [
		{ name : 'id', type : 'string' }, 
		{ name : 'name', type : 'string' }, 
		{ name : 'description', type : 'string' }, 
		{ name : 'directory_id', type : 'string' }, 
		{ name : 'last_released_version', type : 'integer' },
		{ name : 'current_version', type : 'integer' },
		{ name : 'cv_status', type : 'string' }, 
		{ name : 'creator_id', type : 'string' }, 
		{ name : 'updater_id', type : 'string' }, 
		{ name : 'created_at', type : 'date' }, 
		{ name : 'updated_at', type : 'date' }
	],
	
  	proxy: {
		type: 'rest',
		url : '/diagram_definitions',
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