/**
 * Edit Undo Command 
 */
Ext.define('Designer.command.edit.Undo', {	
    
	text : 'Undo',
	
	undoMenu : Ext.getCmp('Menu.edit.Undo'),
	
	undoQuickMenu : Ext.getCmp('Quick.edit.Undo'),
	
  	init: function() {
		var self = this;
		
		Designer.app.eventbus.on('addcanvas', function(hatioCanvas) {
			self.undoMenu.disable();
			self.undoQuickMenu.disable();
			hatioCanvas.getCommandStack().addEventListener(this);
		}, this);
		
		Designer.app.eventbus.on('changecanvas', function(hatioCanvas) {
			if(hatioCanvas) {
				if(hatioCanvas.getCommandStack().canUndo()) {
					self.undoMenu.enable();
					self.undoQuickMenu.enable();
				} else {
					self.undoMenu.disable();
					self.undoQuickMenu.disable();
				}
			}
		}, this);
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(hatioCanvas) 
			hatioCanvas.getCommandStack().undo();
	},
	
	stackChanged : function(event) {
		if(event.getStack().canUndo()) {
			this.undoMenu.enable();
			this.undoQuickMenu.enable();
		} else {
			this.undoMenu.disable();
			this.undoQuickMenu.disable();
		}
	}
});