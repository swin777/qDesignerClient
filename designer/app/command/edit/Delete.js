/**
 * Edit Delete Command 
 */
Ext.define('Designer.command.edit.Delete', {	
    
	text : 'Delete',
	
	deleteMenu : Ext.getCmp('Menu.edit.Delete'),
	
	deleteQuickMenu : Ext.getCmp('Quick.edit.Delete'),
		
  	init: function() {
		var self = this;
		
		Designer.app.eventbus.on('addcanvas', function(hatioCanvas) {
			self.deleteMenu.disable();
			self.deleteQuickMenu.disable();
			hatioCanvas.addSelectionListener(this);
		}, this);
		
		Designer.app.eventbus.on('changecanvas', function(hatioCanvas) {
			if(hatioCanvas) {
				var selectionNode = hatioCanvas.getCurrentSelection();
				
				if(selectionNode) {
					self.deleteMenu.enable();
					self.deleteQuickMenu.enable();
				} else {
					self.deleteMenu.disable();
					self.deleteQuickMenu.disable();
				}
			}
		}, this);
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(hatioCanvas)
			hatioCanvas.removeFigureCommand();
	},
	
	onSelectionChanged : function(figure, figureArr) {
		// single selection
		if(typeof figureArr == 'undefined') {
			if(figure === null) {
				this.deleteMenu.disable();
				this.deleteQuickMenu.disable();
			} else {
				this.deleteMenu.enable();
				this.deleteQuickMenu.enable();
			}
		// multi selection
		} else {
			if(figureArr === null || figureArr.getSize() == 0) {
				this.deleteMenu.disable();
				this.deleteQuickMenu.disable();
			} else {
				this.deleteMenu.enable();
				this.deleteQuickMenu.enable();
			}			
		}
	}
});