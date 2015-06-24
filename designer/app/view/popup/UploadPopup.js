Ext.define('Designer.view.popup.UploadPopup', {
	
	extend : 'Ext.window.Window',

	alias : 'widget.upload_popup',
	
	requires : [
		'Designer.store.Directory',
		'Designer.store.DiagramDefinition',
		'Designer.store.Diagram',
		'Designer.store.DiagramSet'
	],
	
	title : 'Upload Diagram',
	
	modal : true,

	width : 800,
	
	height : 600,
	
	layout : {
		type : 'hbox',
		align : 'stretch'
	},

	
	
	buttons : [ {
		text : T('button.save'),
		itemId : 'save',
		handler : function() {
			var uploadView = this.up('upload_popup');
			var formView = uploadView.down('form');
			var dirIdValue = formView.down('#directory_id').getSubmitValue();
			var diagramTitle = formView.down('#diagram_name').getSubmitValue();
			var form = formView.getForm();
						
			if(!dirIdValue || dirIdValue == '') {
				Ext.Msg.alert('Invalid form', 'Select directory first!');
			} else {
				var hatioCanvas = Designer.app.currentCanvas();
				var pngWriter = new ashDraw.io.png.Writer();
				var png = pngWriter.marshal(hatioCanvas);
				formView.down('#image_data').setValue(png);

			    var jsonWriter = new ashDraw.io.json.Writer();
				var json = JSON.stringify(jsonWriter.marshal(hatioCanvas), null, 2);
				var base64json = Designer.util.Base64.encode(json);
				formView.down('#diagram_content').setValue(base64json);

				var vals = form.getValues();
				var diagramSet = Ext.create('Designer.model.DiagramSet', vals);
				diagramSet.save({
					success : function(record, action) {
						var res = Ext.JSON.decode(action.response.responseText);
						var canvasTab = Designer.app.currentCanvasTab();
						canvasTab.setTitle(diagramTitle);
						canvasTab.setDiagramDefinitionId(res.item.id);
						canvasTab.setDiagramId(res.item.diagram_id);
						canvasTab.setDiagramVersion(res.item.version);
						Ext.Msg.alert(T('label.success'), res._msg);
						uploadView.close();
					},
					failure: function(record, action) {
						Ext.Msg.alert(T('label.failure'), T('msg.failed_to_save'));
					}
				});
			}
		}
	}, 	{
		text : T('button.close'),
		itemId : 'close',
		handler : function() {
			this.up('upload_popup').close();
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
				xtype : 'gridpanel',
				title : T('title.resource_list', {resource : T('title.diagram_definition')}),
				flex : 1,
				store : 'DiagramDefinition',
				columns : [ new Ext.grid.RowNumberer(),
					{ dataIndex : 'name', text : T('label.name'), width : 150 }, 
					{ dataIndex : 'description', text : T('label.description'), width : 250 }, 
					{ dataIndex : 'last_released_version', text : T('label.version') }, 
					{ dataIndex : 'current_version', text : T('label.current_version') }, 
					{ dataIndex : 'cv_status', text : T('label.cv_status') }, 
					{ dataIndex : 'updated_at', text : T('label.updated_at'), 
					  xtype : 'datecolumn', format : 'Y-m-d H:i:s', width : 120 },
				],
			}, {
				xtype : 'form',
				title : T('title.diagram'),
				autoScroll : true,
				bodyPadding : 10,
				margin : '5 0 0 0',
				defaults : { xtype : 'textfield', anchor : '100%' },
				items : [
					{ itemId : 'diagram_name', name : 'name', fieldLabel : T('label.name') }, 
					{ name : 'description', fieldLabel : T('label.description') }, 
					{ name : 'version', value : 1, hidden : true }, 
					{ itemId : 'directory_id', name : 'directory_id', hidden : true }, 
					{ name : 'status', value : 'D', hidden : true }, 
					{ itemId : 'image_data', name : 'image_data', hidden : true }, 
					{ itemId : 'diagram_content', name : 'content', hidden : true },
				],
			} ]
		} ];
		this.reloadTree();
		this.callParent(arguments);
		this.down('treepanel').on('itemclick', this.treeItemClick, this);
	},

	/**
	 * 디 렉 토 리 트 리 정 보 를 Datasource 에 서 얻 어 와 서 로 딩
	 */	
	reloadTree : function() {
		var dirStore = Ext.getStore('Directory');
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
	 * 트리 클릭시 선택된 디렉토리 하위의 다이어그램 리스트를 표시 ...
	 */
	treeItemClick : function(tree, record, item, index, e, eOpts) {
		this.down('form').setTitle('Diagram (' + record.data.text + ')');
		var directoryView = this.down('#directory_id');
		directoryView.setValue(record.data.id);
		var diagramDefinitionStore = Ext.getStore('DiagramDefinition');
		diagramDefinitionStore.clearFilter(true);
		diagramDefinitionStore.filter([ {
			property : 'directory_id_eq',
			value : record.data.id
		} ]);
	}
});