Ext.define('Designer.store.Notation', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Designer.model.Notation',
	
	model : 'Designer.model.Notation',
	
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