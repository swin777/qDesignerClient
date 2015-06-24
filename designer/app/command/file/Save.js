/**
 * File Save Command 
 */
Ext.define('Designer.command.file.Save', {	
    
	text : 'Save',
	
	saveMenu : Ext.getCmp('Menu.file.Save'),
	
	saveQuickMenu : Ext.getCmp('Quick.file.Save'),
		
  	init: function() {
		if(!Designer.app.useWebDB) {
			this.saveMenu.disable();
			this.saveQuickMenu.disable();
		}
	},

	execute : function() {
		var content = Ext.getCmp('content');
		var activeItem = content.layout.getActiveItem();
		if(!activeItem) {
			return;
		}
		
		var hatioCanvas = activeItem.getHatioCanvas()
		if(!hatioCanvas) {
			return;
		}
		
		var diagramId = activeItem.getDiagramId();
    	var writer = new ashDraw.io.json.Writer();
		var json = JSON.stringify(writer.marshal(hatioCanvas), null, 2);
				
		if(diagramId != null) {
			Designer.app.db.transaction(function (tx) {
				tx.executeSql(
					'UPDATE DIAGRAMS SET content = ?, updated_at = ? WHERE ID = ?', 
					[json, Ext.Date.format(new Date(), 'Y-m-d H:i:s'), diagramId],
					function(transaction, result) {
						Ext.Msg.alert('Success', 'Diagram saved!');
					},
					function(e) {
						Ext.Msg.alert('Failure', 'Failed to save diagram!');
					}
				);
			});
		} else {
			Ext.create('Ext.window.MessageBox').prompt('Save Temporarily', 'Please enter diagram title', function(btn, title) {
				if(btn == 'ok') {
					Designer.app.db.transaction(function (tx) {
						tx.executeSql(
							'INSERT INTO DIAGRAMS (user_id, title, content, updated_at) VALUES (?, ?, ?, ?)', 
							['', title, json, Ext.Date.format(new Date(), 'Y-m-d H:i:s')],
							function(transaction, result) {
								var canvasTab = Designer.app.currentCanvasTab();
								canvasTab.setDiagramId(result.insertId);
								canvasTab.setTitle(title);
								Ext.Msg.alert('Success', 'Success to create diagram!');
							},
							function() {
								Ext.Msg.alert('Failure', 'Failed to create diagram!');
							});
						}
					);
				} 
			}, this);			
		}
	}
});