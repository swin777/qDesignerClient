/**
 * File New Command 
 */
Ext.define('Designer.command.file.New', {	
    
	text : 'New',
		
  	init: function() {
	},

	execute : function() {
		var content = Ext.getCmp('content');
		var canvas = Ext.create('Designer.view.Canvas', {title : 'New'});
		content.add(canvas);
		content.layout.setActiveItem(canvas);
		canvas.createExCanvas();
	}
	
});