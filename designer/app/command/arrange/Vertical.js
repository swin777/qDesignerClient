/**
 * Arrange Vertical Command 
 */
Ext.define('Designer.command.arrange.Vertical', {	
    
	text : 'Vertical',
	
	verticalMenu : Ext.getCmp('Menu.arrange.Vertical'),
	
	verticalQuickMenu : Ext.getCmp('Quick.arrange.Vertical'),	
		
  	init: function() {
		var self = this;
		
		Designer.app.eventbus.on('addcanvas', function(hatioCanvas) {
			self.verticalMenu.disable();
			self.verticalQuickMenu.disable();
			hatioCanvas.addSelectionListener(this);
		}, this);
		
		Designer.app.eventbus.on('changecanvas', function(hatioCanvas) {
			if(hatioCanvas && typeof hatioCanvas.currentMultiSelection === "function") {
				var ms = hatioCanvas.currentMultiSelection();
				
				if(!ms || ms.getSize() == 0) {
					self.verticalMenu.enable();
					self.verticalQuickMenu.enable();
				} else {
					self.verticalMenu.disable();
					self.verticalQuickMenu.disable();
				}
			}
		}, this);	
	},

	execute : function() {
		var content = Ext.getCmp('content');
		var canvas = content.layout.getActiveItem();
		var hatioCanvas = canvas.getHatioCanvas();
		hatioCanvas.verAlign();
	},
	
	onSelectionChanged : function(figure, figureArr) {
		if(typeof figureArr != 'undefined') {
			if(figureArr === null || figureArr.getSize() == 0) {
				this.verticalMenu.disable();
				this.verticalQuickMenu.disable();
			} else {
				this.verticalMenu.enable();
				this.verticalQuickMenu.enable();
			}			
		}
	}	
});