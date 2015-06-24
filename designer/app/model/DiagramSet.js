Ext.define('Designer.model.DiagramSet', {
    
	extend: 'Ext.data.Model',
    
	fields: [
		{ name : 'id', type : 'string' }, 
		{ name : 'name', type : 'string' }, 
		{ name : 'description', type : 'string' }, 
		{ name : 'directory_id', type : 'string' }, 
		{ name : 'content', type : 'text' },
		{ name : 'image_data', type : 'string' }
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