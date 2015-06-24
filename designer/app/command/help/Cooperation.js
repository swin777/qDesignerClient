/**
 * Help Cooperation Command 
 */
Ext.define('Designer.command.help.Cooperation', {	
    
	text : 'Cooperation',
	
	reexcutable : false,
	
  	init: function() {
	},

	execute : function() {
		var currentCanvasTab = Designer.app.currentCanvasTab();
		
		if(!currentCanvasTab) {
			Ext.Msg.alert('Warning', 'Nof found diagram to cooperate!');
		} else {
			var diagramId = currentCanvasTab.getDiagramId();
			if(!diagramId || diagramId == '') {
				Ext.Msg.alert('Warning', 'Nof found diagram to cooperate!');
			} else {
				Ext.Msg.prompt('Collaboration', 'Enter the user id that you want to cooperate!', function(btn, userId) {
					Designer.app.eventbus.fireEvent('cooperrequest', userId, diagramId, currentCanvasTab.title);
				}, this);
			}
		}
	}
});