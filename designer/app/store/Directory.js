Ext.define('Designer.store.Directory', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Designer.model.Directory',
	
	model : 'Designer.model.Directory',
	
	autoLoad : false,
	
	remoteFilter : true,
	
	remoteSort : true	
	
});