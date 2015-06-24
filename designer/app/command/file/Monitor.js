/**
 * File Monitor Command 
 */
Ext.define('Designer.command.file.Monitor', {	
    
	text : 'Monitor',
	
  	init: function() {
	},

	execute : function() {
		var canvasTab = Designer.app.currentCanvasTab();
		if(!canvasTab) 
			return;
			
		var window_id = "Diagram Monitor";
		var url = "http://" + document.location.host + '/monitor?diagram_id=' + canvasTab.getDiagramId();
		var window_width = screen.width;
		var window_height = screen.height;
		var resizable_yn = "no";
		var scrollbar_yn = "yes";
		var status_yn = "no";
		var toolbars_yn = "no";
		var location_yn = "no";
		var menu_yn = "no";
		var window_left = (screen.width - window_width) / 2;
		var window_top = (screen.height - window_height) / 2;
		var window_option = "width=" + window_width + ", height=" + window_height + ", left=" + window_left + ", top=" + window_top + ", scrollbars=" + scrollbar_yn + ", resizable=" + resizable_yn + ", status=" + status_yn + ", toolbars=" + toolbars_yn + ", location=" + location_yn + ", menu=" + menu_yn;
		var win = window.open(url, window_id, window_option);
		win.focus();
	}	
});