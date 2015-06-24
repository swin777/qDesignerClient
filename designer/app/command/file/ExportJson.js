/**
 * File ExportSJson Command 
 */
Ext.define('Designer.command.file.ExportJson', {	
    
	text : 'ExportJson',
	
  	init: function() {
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(!hatioCanvas) 
			return;
			
	    var writer = new ashDraw.io.json.Writer();
		var json = JSON.stringify(writer.marshal(hatioCanvas), null, 2);
		var items = [ {
			xtype : 'textareafield',
			grow : true,
			name : 'svg',
			margin : '0 15 5 5',
			width : '100%',
			anchor : '100%',
			value : json,
			readOnly : true,
			autoScroll : true
		} ];
		
		var exportPopup = Ext.create('Designer.view.popup.CommonPopup', {title : 'Export JSON', autoScroll : false, items : items});
		exportPopup.show();
	}	
});