Ext.define('Designer.store.DiagramDefinition', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Designer.model.DiagramDefinition',
	
	model : 'Designer.model.DiagramDefinition',
	
	autoLoad : false,
	
	remoteFilter : true,
	
	remoteSort : true	
	
});