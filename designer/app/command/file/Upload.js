/**
 * File Upload Command 
 */
Ext.define('Designer.command.file.Upload', {
    
	text : 'Upload',
		
  	init: function() {
	},

	execute : function() {
		var canvasTab = Designer.app.currentCanvasTab();
		
		if(!canvasTab) {
			Ext.Msg.alert('No canvas', 'There is no canvas to save!');
			
		} else {
			var diagramDefinitionId = canvasTab.getDiagramDefinitionId();
			var diagramId = canvasTab.getDiagramId();
			var diagramVersion = canvasTab.getDiagramVersion();
			
			// 다운로드한 다이어그램 일 경우 ...
			if(diagramId) {
				var hatioCanvas = Designer.app.currentCanvas();
				var pngWriter = new ashDraw.io.png.Writer();
				var imageData = pngWriter.marshal(hatioCanvas);

			    var jsonWriter = new ashDraw.io.json.Writer();
				var json = JSON.stringify(jsonWriter.marshal(hatioCanvas), null, 2);
				var base64Content = Designer.util.Base64.encode(json);
				
				var values = {
					id : diagramId, 
					diagram_definition_id : diagramDefinitionId, 
					version : diagramVersion, 
					image_data : imageData, 
					content : base64Content,
					status : 'D'}; // TODO status 하드코딩 제거 ...
				var diagram = Ext.create('Designer.model.Diagram', values);
				
				diagram.save({
					success : function(record, action) {
						var res = Ext.JSON.decode(action.response.responseText);
						Ext.Msg.alert(T('label.success'), res._msg);
					},
					failure: function(record, action) {
						Ext.Msg.alert(T('label.failure'), T('msg.failed_to_save'));
					}
				});
			// 새 다이어그램일 경우 ...
			} else {
				var uploadPopup = Ext.create('Designer.view.popup.UploadPopup');
				uploadPopup.show();
			}
		}
	}
	
});