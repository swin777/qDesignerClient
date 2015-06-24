Ext.define('Designer.store.NotationNode', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Designer.model.NotationNode',
	
	model : 'Designer.model.NotationNode',
	
	autoLoad : false,
	
	remoteFilter : true,
	
	remoteSort : true,
	
	filters: [ {
		property: 'status_eq',
		value: 'R'
	} ],
	
	sorters: [ {
		property : 'rank',
		direction: 'ASC'
	} ]
});