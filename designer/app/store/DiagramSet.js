Ext.define('Designer.store.DiagramSet', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Designer.model.DiagramSet',
	
	model : 'Designer.model.DiagramSet',
	
	autoLoad : false,
	
	remoteFilter : true,
	
	remoteSort : true	
	
});