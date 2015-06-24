Ext.define('Designer.view.popup.CommonPopup', {
	
	extend : 'Ext.window.Window',

	alias : 'widget.common_popup',
		
	modal : true,

	width : 600,
	
	height : 400,
	
	buttons : [ {
		text : T('button.close'),
		itemId : 'close',
		handler : function() {
			this.up('common_popup').close();
		}
	} ]

});