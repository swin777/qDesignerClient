/**
 * Arrange Autolayout Command 
 */
Ext.define('Designer.command.arrange.Autolayout', {	
    
	text: 'Autolayout',
	
	reexcutable: false,
	
  	init: function() {
	},

	execute: function() {
		var content = Ext.getCmp('content');
		var hatioCanvas = Designer.app.currentCanvas();
		
		if(!hatioCanvas) {
			return;
		}
		
	    var writer = new ashDraw.io.json.Writer();
		var diagramContent = JSON.stringify(writer.marshal(hatioCanvas), null, 2);
		if(!diagramContent || diagramContent.length < 5) {
			Ext.Msg.alert('No content', 'Empty canvas!');
			return;
		}
		
		var store = Ext.create('Ext.data.Store', {
		    fields: ['name', 'value'],
		    data : [
				{"name":"TreeLayout", 			"value":"TreeLayout"},
				{"name":"SugiyamaLayout", 		"value":"SugiyamaLayout"},
				{"name":"SpringLayout", 		"value":"SpringLayout"},
				{"name":"RadialLayout", 		"value":"RadialLayout"},
				{"name":"HorizontalShift",		"value":"HorizontalShift"},
				{"name":"GridLayout", 			"value":"GridLayout"},
				{"name":"DirectedGraphLayout", 	"value":"DirectedGraphLayout"},
				{"name":"BoxLayout", 			"value":"BoxLayout"}
		    ]
		});
		
		var items = [ {
			xtype : 'combo',
			fieldLabel : 'Choose layout',
			margin : '8 5 5 8',
			width : '100%',
			anchor : '100%',
			store : store,
			queryMode : 'local',
			displayField : 'name',
			valueField : 'value',
			value : 'TreeLayout'
		} ];
		
		var autolayoutPopup = Ext.create('Ext.window.Window', {
			width: 300, 
			height: 100, 
			title: 'Auto Layout', 
			autoScroll : false, 
			items : items,
			buttons : [ {
				text : T('button.select'),
				handler : function() {
					var win = this.up('window');
					var layout = win.down('combo');
					var layoutValue = layout.getValue();
					hatioCanvas.autoLayOut(layoutValue);
				}
			}, {
				text : T('button.close'),
				handler : function() {
					this.up('window').close();
				}
			} ]
		});
		autolayoutPopup.show();
	}
	
});