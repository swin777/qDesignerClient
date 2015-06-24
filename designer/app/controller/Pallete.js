Ext.define('Designer.controller.Pallete', {
	extend: 'Ext.app.Controller',
	
	requires : [ 'Designer.view.notation.NotationNode' ],
	
	stores : [ 'Notation', 'NotationNode' ],
		
	views : [ 'Designer.view.Pallete', 'Designer.view.notation.Container' ],
			
	refs: [ {
		ref : 'pallete',
		selector : 'pallete'
	} ],
    
	init: function() {
		this.control({
			'pallete notation_container div': {
				click: this.onNotationClick
			},
			'pallete notation_container': {
				expand: this.onExpandContainer
			}
		});
	},
	
	onLaunch : function() {
		//this.loadNotations();
	},
	
	loadNotations : function() {
		var notationStore = this.getStore('Notation');
		notationStore.load({
			callback: this.onNotationsLoaded,
			scope: this
		});
	},
	
	loadNotationNodes : function(panel) {
		var self = this;
		var notationId = panel.id;
		var nodeStore = this.getStore('NotationNode');
		nodeStore.clearFilter(true);
		nodeStore.filter('notation_id_eq', notationId);
		nodeStore.filter('status_eq', 'R');
		nodeStore.load({
			callback: function(records, operation, success) {
				Ext.each(records, function(record) {
					var nodeInfo = record.getData();
					nodeInfo.shape_data = Designer.util.Base64.decode(nodeInfo.shape_data);
					var node = Ext.create('Designer.view.notation.NotationNode', { nodeInfo : nodeInfo });
					panel.add(node);
				});
				panel.nodesLoaded();
			},
			scope: this
		});
	},
	
	onNotationsLoaded : function(records, operation, success) {
		var self = this;
		var palleteView = this.getPallete();
		Ext.each(records, function(record) {
			var config = {id : record.data.id, title : record.data.name};
			var notationContainer = Ext.create('Designer.view.notation.Container', config);
			//self.loadNotationNodes(notationContainer);
			palleteView.add(notationContainer);
		});
	},
	
	onNotationClick: function(notation, event, eOpts) {
		alert('notation click!');
	},
	
	onExpandContainer: function(panel, eOpts) {
		if(!panel.isLoaded())
			this.loadNotationNodes(panel);
	}
});