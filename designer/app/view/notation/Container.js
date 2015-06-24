Ext.define('Designer.view.notation.Container', {

	extend : 'Ext.panel.Panel',
	
	alias : 'widget.notation_container',
	
	autoScroll : true,
	
	layout : {
		type: 'table',
		columns : 3
	},
	
	isLoaded : function() {
		return this.items.length > 0 ? true : false;
	},
	
	nodesLoaded : function(){
		Designer.app.eventbus.fireEvent('palleteLoad');
	}
});