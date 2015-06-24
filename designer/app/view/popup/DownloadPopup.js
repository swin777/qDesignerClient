Ext.define('Designer.view.popup.DownloadPopup', {
	
	extend : 'Ext.window.Window',

	alias : 'widget.download_popup',
	
	requires : [
		'Designer.store.Directory',
		'Designer.store.DiagramDefinition',
		'Designer.store.Diagram'
	],
	
	title : 'Download Diagram',
	
	modal : true,
	
	autoDestroy : true,

	width : 800,
	
	height : 600,
	
	diagramDefinitionId : '',
	
	diagramId : '',
	
	diagramVersion : -1,
	
	diagramTitle : '',
	
	layout : {
		type : 'hbox',
		align : 'stretch'
	},

	
	
	buttons : [ {
		text : T('button.open'),
		itemId : 'open'
	}, {
		text : T('button.close'),
		itemId : 'close',
		handler : function() {
			this.up('download_popup').close();
		}
	} ],
	
	initComponent : function() {
		this.items = [ {
			xtype : 'treepanel',
			flex : 1,
			title : T('title.resource_list', {resource : T('title.directory')}),
			margin : '5 5 5 5',
			store : Ext.create('Ext.data.TreeStore', {root: {}})
		}, {
			xtype : 'container',
			margin : '5 5 5 0',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			flex : 3,
			items : [ {
				itemId : 'definition_list',
				xtype : 'gridpanel',
				store : 'DiagramDefinition',
				title : T('title.resource_list', {resource : T('title.diagram_definition')}),
				flex : 2,
				columns : [ new Ext.grid.RowNumberer(),
					{ dataIndex : 'name', text : T('label.name'), width : 150 }, 
					{ dataIndex : 'description', text : T('label.description'), width : 250 }, 
					{ dataIndex : 'last_released_version', text : T('label.last_released_version'), width : 50 }, 
					{ dataIndex : 'current_version', text : T('label.current_version'), width : 50 }, 
					{ dataIndex : 'cv_status', text : T('label.cv_status'), width : 45 }
				],
			}, 	{
				itemId : 'diagram_list',
				xtype : 'gridpanel',
				store : 'Diagram',
				title : T('title.resource_list', {resource : T('title.diagram')}),
				flex : 3,
				columns : [ new Ext.grid.RowNumberer(),
					{ dataIndex : 'id', hidden : true }, 
					{ dataIndex : 'diagram_definition_id', hidden : true }, 
					{ dataIndex : 'version', text : T('label.version'), width : 50 }, 
					{ dataIndex : 'status', text : T('label.status'), width : 45 }, 
					{ dataIndex : 'updated_at', text : T('label.updated_at'), 
					  xtype : 'datecolumn', format : 'Y-m-d H:i:s', width : 120 }
				],
			} ]
		} ];
		
		this.reloadTree();
		this.callParent(arguments);
		this.down('treepanel').on('itemclick', this.treeItemClick, this);
		this.down(' #definition_list').on('itemclick', this.definitionItemClick, this);
		this.down(' #diagram_list').on('itemclick', this.diagramItemClick, this);
	},
	
	/**
	 * 디 렉 토 리 트 리 정 보 를 Datasource 에 서 얻 어 와 서 로 딩
	 */
	reloadTree : function() {
		var dirStore = Ext.getStore('Directory');
		dirStore.clearFilter(true);
		dirStore.load({
			callback : this.onDirectoryLoad,
			scope : this
		});	
	},
	
	/**
	 * 디 렉 토 리 트 리 정 보 를 TreeStore에 맞게 데이터 변형 
	 */
	onDirectoryLoad : function(records, operation, success) {
		var directoryTree = this.getTreeChildren(records, 'root');
		this.down('treepanel').store.setRootNode({ expanded: true, children: directoryTree });
	},
	
	/**
	 * 디 렉 토 리 트 리 정 보 트리 구조로 정렬 
	 */
	getTreeChildren : function(records, parentId) {
		var self = this;
		var children = [];		
		Ext.each(records, function(record) {
			if((record.data.parent_id == parentId)) {
				var myChildren = self.getTreeChildren(records, record.data.id);
				var dirElement = { 
					id : record.data.id, 
					text : record.data.name,
					leaf : !(myChildren.length > 0), 
					expanded : true, 
					children : myChildren 
				};
				children.push(dirElement);
			}
		});
		return children;
	},
	
	/**
	 * 트리 클릭시 선택된 디렉토리 하위의 다이어그램 정의 리스트를 표시 ...
	 */
	treeItemClick : function(tree, record, item, index, e, eOpts) {
		var diagramDefinitionStore = Ext.getStore('DiagramDefinition');
		diagramDefinitionStore.clearFilter(true);
		diagramDefinitionStore.filter([ {
			property : 'directory_id_eq',
			value : record.data.id
		} ]);
	},
	
	/**
	 * 다이어그램 정의 그리드 선택시 선택된 디렉토리 하위의 다이어그램 리스트를 표시 ...
	 */
	definitionItemClick : function(grid, record, item, index, event, eOpts) {
		this.diagramDefinitionId = record.data.id;
		this.diagramTitle = record.data.name;
		var diagramDStore = Ext.getStore('Diagram');
		diagramDStore.clearFilter(true);
		diagramDStore.filter([ {
			property : 'diagram_definition_id_eq',
			value : record.data.id
		} ]);
	},
	
	/**
	 * 다이어그램 그리드 선택시 선택된 다이어그램 아이디, 버전을 기억 ...
	 */
	diagramItemClick : function(grid, record, item, index, event, eOpts) {
		this.diagramId = record.data.id;
		this.diagramVersion = record.data.version;
	},
	
	/**
	 * 클라이언트에서 사용
	 */
	showPopup : function(callback) {
		this.show();
		var self = this;
		
		this.down(' #open').on('click', function(btn, e, eOpts) {
			var data = {id : self.diagramId, version : self.diagramVersion, name : self.diagramTitle, diagram_definition_id : self.diagramDefinitionId};
			Ext.callback(callback, this, [data]);
			self.destroy();
			self.close();
		});
		
		this.down(' #diagram_list').on('itemdblclick', function(grid, record, item, index, event, eOpts) {
			var data = {id : self.diagramId, version : self.diagramVersion, name : self.diagramTitle, diagram_definition_id : self.diagramDefinitionId};
			Ext.callback(callback, this, [data]);
			self.destroy();
			self.close();
		}, this);
	}
});