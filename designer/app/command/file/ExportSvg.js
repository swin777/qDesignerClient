/**
 * File ExportSvg Command 
 */
Ext.define('Designer.command.file.ExportSvg', {	
    
	text : 'ExportSvg',
	
  	init: function() {
	},

	execute : function() {
		var hatioCanvas = Designer.app.currentCanvas();
		if(!hatioCanvas) 
			return;
			
		var writer = new ashDraw.io.svg.Writer();
		var svg = writer.marshal(hatioCanvas);
		
		/*var items = [ {
			xtype : 'container',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			autoScroll : false,
			items : [ {
				html : "<h2>SVG Output</h2>",
				margin : '5 15 5 5'
			}, {
				xtype : 'textareafield',
				html : "<h2>SVG Output</h2>",
				grow : true,
				margin : '0 15 5 5',
				anchor : '100%',
				value : svg,
				readOnly : true
			} ]
		} ];*/
		
		var items = [ {
			xtype : 'textareafield',
			grow : true,
			name : 'svg',
			margin : '0 15 5 5',
			width : '100%',
			anchor : '100%',
			value : svg,
			readOnly : true,
			autoScroll : true
		} ];		
		
		var exportPopup = Ext.create('Designer.view.popup.CommonPopup', {title : 'Export SVG', autoScroll : false, items : items});
		exportPopup.show();
	}	
});