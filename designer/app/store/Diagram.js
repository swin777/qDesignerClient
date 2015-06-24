Ext.define('Designer.store.Diagram', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Designer.model.Diagram',
	
	model : 'Designer.model.Diagram',
	
	autoLoad : false,
	
	remoteFilter : true,
	
	remoteSort : true	
	
});