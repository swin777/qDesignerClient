Ext.define('Designer.controller.Menu', {
	
	extend: 'Ext.app.Controller',
		
	views : [ 
		'Designer.view.Menu',
		'Designer.view.QuickMenu'
	],
		
	stores: [ 'Menu' ],
		
	refs: [ {
		ref : 'mainMenu',
		selector : 'mainmenu'
	}, {
		ref : 'quickMenu',
		selector : 'quickmenu'
	} ],
    
	init: function() {
		this.control({
			'mainmenu menuitem': {
				click : this.onMenuClick
			},
			'quickmenu button' : {
				click : this.onQuickMenuClick
			}
		});
	},

	onLaunch: function() {
		var menuStore = this.getMenuStore();
		menuStore.load({
			callback: this.onMenusLoad,
			scope: this
		});
	},

	/**
	 * 메 뉴 정 보 를 Datasource 에 서 얻 어 와 서 로 딩
	 */
	onMenusLoad: function(records, operation, success) {
		var mainMenuTb = this.getMainMenu();
		var quickMenu = this.getQuickMenu();
				 
		var menus = [];
		var quickMenus = [];
		var parentMenuHsh = {};
		var quickParentMenuHsh = {};
				
		Ext.each(records, function(record) {	
			if(record.data.parent_id == 0) {
				// main menu
				var pMenu = { xtype : 'button', text : record.data.name, menu : [] };
				parentMenuHsh[record.data.id] = pMenu;
				menus.push(pMenu);
				
				// quick menu
				if(record.data.quick_menu && record.data.quick_menu == 'Y') {
					var quickParentMenu = { xtype : 'buttongroup', title : record.data.name, items : [] };
					quickParentMenuHsh[record.data.id] = quickParentMenu;
					quickMenus.push(quickParentMenu);
				}
			}
		});
		
		Ext.each(records, function(record) {
			if(record.data.parent_id != 0) {
				// main menu
				var parentMenu = parentMenuHsh[record.data.parent_id];
				var menuId = 'Menu.' + record.data.command;
				parentMenu.menu.push({ id : menuId, xtype : 'menuitem', text : record.data.name });
				
				// quick menu
				if(record.data.quick_menu && record.data.quick_menu == 'Y') {
					var quickParentMenu = quickParentMenuHsh[record.data.parent_id];
					if(quickParentMenu) {
						var quickMenuId = 'Quick.' + record.data.command;
						quickParentMenu.items.push({ id : quickMenuId, xtype : 'button', text : record.data.name });
					}
				}
			}
		});
		
		mainMenuTb.add(menus);
		quickMenu.add(quickMenus);
		Designer.command.CommandManager.init(menus);
		
		// 초기 첫 canvass loading
		var newCommand = Ext.create('Designer.command.file.New');
		newCommand.execute();
	},
    
	onMenuClick : function(menu, item, e, eOpts) {
		if(menu.xtype == 'menuitem') {
			Designer.command.CommandManager.executeCommand(menu.id, {});
		}
	},
	
	onQuickMenuClick : function(button, event, eOpts) {
		Designer.command.CommandManager.executeCommand(button.id, {});
	}
});