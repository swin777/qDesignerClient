/**
 * File ExportPng Command 
 */
Ext.define('Designer.command.file.ExportPng', {	
    
	text : 'ExportPng',
	
  	init: function() {
	},

	execute : function() {
		var content = Ext.getCmp('content');
		var hatioCanvas = Designer.app.currentCanvas();
		if(!hatioCanvas) 
			return;
			
		var writer = new ashDraw.io.png.Writer();
		var png = writer.marshal(hatioCanvas);
		var html = '<img class="shadow" id="export_png" src="' + png + '" width="95%" height="95%" style="border-radius:5px; overflow:auto; position:absolute; top:5px; right:5px; left:5px; bottom:5px; border:3px solid gray;"/>';
		var exportPopup = Ext.create('Designer.view.popup.CommonPopup', {title : 'Export PNG', html : html});
		exportPopup.show();
	}	
});