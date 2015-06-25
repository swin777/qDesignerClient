/**
 * File Download Command 
 */
Ext.define('Designer.command.file.Download', {	
    
	text : 'Download',
		
  	init: function() {
	},

	execute : function() {
		var self = this;
		
		var downloadPopup = Ext.create('Designer.view.popup.DownloadPopup');
		downloadPopup.showPopup(function(record) {
			var diagramId = record.id;
			var diagramVersion = record.version;
			var diagramTitle = record.name;
			var diagramDefinitionId = record.diagram_definition_id;
			var selectedCanvas = Designer.app.findCanvasTab(diagramId);
			
			if(selectedCanvas) {
				var content = Ext.getCmp('content');
				content.layout.setActiveItem(selectedCanvas);
				// TODO 덮어쓸것이지 물어보고 나서 액션 ...
			} else {
				self.download(diagramId, diagramTitle);
			}
		});
	},
	
	download : function(diagramId, diagramTitle, canvasStackListener) {
		Designer.app.progressStart();
		Designer.model.Diagram.load(diagramId, {
			scope : this,
			success: function(rec, action) {
				var diagramJson = Ext.JSON.decode(action.response.responseText);
				var diagramContent = (!diagramJson.content || diagramJson.content == '') ? '' : Designer.util.Base64.decode(diagramJson.content);
				var content = Ext.getCmp('content');
				var canvas = Ext.create('Designer.view.Canvas', {
					diagramDefinitionId : diagramJson.diagram_definition_id,
					diagramId : diagramId, 
					diagramVersion : diagramJson.version, 
					title : diagramTitle
				});
				content.add(canvas);
				content.layout.setActiveItem(canvas);
				canvas.createExCanvas(diagramContent);
				
				if(canvasStackListener) {
					canvas.getHatioCanvas().getCommandStack().addEventListener(canvasStackListener);
				}
				Designer.app.progressEnd();
			},
			failure: function(record, operation) {
				Ext.Msg.alert('Failure', 'Failed to download diagram!');
				Designer.app.progressEnd();
			}
		});
	}
	
});