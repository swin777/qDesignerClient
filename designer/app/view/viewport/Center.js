Ext.define('Designer.view.viewport.Center', {

	extend : 'Ext.tab.Panel',
	
	requires : 'Designer.view.Canvas',

	alias : 'widget.viewport.center',
	
	id : 'content',

	layout : 'card',
	
	initComponent : function() {
		this.callParent(arguments);
		
		this.on('tabchange', function(tabpanel, newCard, oldCard, eOpts) {
			Designer.app.eventbus.fireEvent('changecanvas', newCard.getHatioCanvas());
		});
		
		this.on('remove', function(container, component, index, eOpts) {
			if(component.alias && component.alias == 'widget.canvas') {
			}
		});		
	}
});