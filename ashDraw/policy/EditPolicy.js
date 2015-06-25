define(["dojo/_base/declare"], function(declare){
	var EditPolicy = declare("ashDraw.policy.EditPolicy", null, {
		constructor: function(){
	    },
	    
	    getRole:function(){
	        
	    }
	});
	EditPolicy.Role = { 
	   PRIMARY_DRAG_ROLE : 0 ,
	   DIRECT_EDIT_ROLE:1,
	   SELECTION_FEEDBACK_ROLE:2
	};
	return EditPolicy;
});