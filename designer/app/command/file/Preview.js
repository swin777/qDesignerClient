/**
 * File Preview Command 
 */
Ext.define('Designer.command.file.Preview', {	
    
	text : 'Preview',
	
  	init: function() {
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(!hatioCanvas) 
			return;
			
		var writer = new ashDraw.io.png.Writer();
		var png = writer.marshal(hatioCanvas);
		var html = '<img class="shadow" id="export_png" src="' + png + '" width="98%" height="98%" style="border-radius:5px; overflow:auto; position:absolute; top:5px; right:5px; left:5px; bottom:5px; border:3px solid gray;"/>';		
		var exportPopup = Ext.create('Designer.view.popup.CommonPopup', {width : 800, height : 600, title : 'Preview', html : html});
		exportPopup.show();
	}	
});