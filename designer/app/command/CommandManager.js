/**
 * Command 및 CommandStack 관 리 
 * @singleton
 */
Ext.define('Designer.command.CommandManager', {	
    
	singleton: true,

	commandMap : {},
	
    init: function(menus) {
		var self = this;
		Ext.each(menus, function(menu) {
			Ext.each(menu.menu, function(menuItem) {
				var commandId = self.convertCommandId(menuItem.id);
				var command = Ext.create(commandId, {});
				command.init();
				self.commandMap[commandId] = command;
			});
		});
    },

    getCommand : function(commandId, config) {
		return this.commandMap[commandId];
	},

	executeCommand : function(commandId, config) {			
		if(!config) {
			config = {};
		}				
			
		commandId = this.convertCommandId(commandId);
		var command = this.getCommand(commandId, config);
		if(command) {
			command.execute(config);
		} else {
			alert('Menu has no command!');
		}
	},
	
	convertCommandId : function(commandId) {
		var index = commandId.indexOf(".");
		return "Designer.command." + commandId.substring(index + 1);
	}
});