/**
 * Arrange Horizontal Command 
 */
Ext.define('Designer.command.arrange.Horizontal', {	
    
	text : 'Horizontal',
		
	horizontalMenu : Ext.getCmp('Menu.arrange.Horizontal'),
	
	horizontalQuickMenu : Ext.getCmp('Quick.arrange.Horizontal'),
		
  	init: function() {
		var self = this;
		
		Designer.app.eventbus.on('addcanvas', function(hatioCanvas) {
			self.horizontalMenu.disable();
			self.horizontalQuickMenu.disable();
			hatioCanvas.addSelectionListener(this);
		}, this);
		
		Designer.app.eventbus.on('changecanvas', function(hatioCanvas) {
			if(hatioCanvas && typeof hatioCanvas.currentMultiSelection === "function") {
				var ms = hatioCanvas.currentMultiSelection();
				
				if(!ms || ms.getSize() == 0) {
					self.horizontalMenu.enable();
					self.horizontalQuickMenu.enable();
				} else {
					self.horizontalMenu.disable();
					self.horizontalQuickMenu.disable();
				}
			}
		}, this);
	},

	execute : function() {
		var content = Ext.getCmp('content');
		var canvas = content.layout.getActiveItem();
		var hatioCanvas = canvas.getHatioCanvas();
		hatioCanvas.horAlign();
	},
	
	onSelectionChanged : function(figure, figureArr) {
		if(typeof figureArr != 'undefined') {
			if(figureArr === null || figureArr.getSize() == 0) {
				this.horizontalMenu.disable();
				this.horizontalQuickMenu.disable();
			} else {
				this.horizontalMenu.enable();
				this.horizontalQuickMenu.enable();
			}			
		}
	}	
});