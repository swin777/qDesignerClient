/**
 * Option ToManager Command 
 */
Ext.define('Designer.command.option.ToManager', {	
    
	text : 'ToManager',
	
	reexcutable : false,
	
  	init: function() {
	},

	execute : function() {
		var loc = document.location;
		document.location.href = "http://" + loc.host + '/dynagram/manager/index.html';
	}
});