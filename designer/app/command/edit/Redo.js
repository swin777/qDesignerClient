/**
 * Edit Redo Command 
 */
Ext.define('Designer.command.edit.Redo', {	
    
	text : 'Redo',
	
	redoMenu : Ext.getCmp('Menu.edit.Redo'),
	
	redoQuickMenu : Ext.getCmp('Quick.edit.Redo'),
	
  	init: function() {
		var self = this;
		
		Designer.app.eventbus.on('addcanvas', function(hatioCanvas) {
			self.redoMenu.disable();
			self.redoQuickMenu.disable();
			hatioCanvas.getCommandStack().addEventListener(this);
		}, this);
		
		Designer.app.eventbus.on('changecanvas', function(hatioCanvas) {
			if(hatioCanvas) {
				if(hatioCanvas.getCommandStack().canRedo()) {
					self.redoMenu.enable();
					self.redoQuickMenu.enable();
				} else {
					self.redoMenu.disable();
					self.redoQuickMenu.disable();
				}
			}
		}, this);
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(hatioCanvas) 
			hatioCanvas.getCommandStack().redo();
	},
	
	stackChanged : function(event) {
		if(event.getStack().canRedo()) {
			this.redoMenu.enable();
			this.redoQuickMenu.enable();
		} else {
			this.redoMenu.disable();
			this.redoQuickMenu.disable();
		} 
	}
});