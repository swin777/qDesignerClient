define(["dojo/_base/declare", "ashDraw/shape/basic/Diamond"], function(declare){
	return declare("ashDrawEx.shape.node.basic.Diamond", ashDraw.shape.basic.Diamond, {

	    NAME : "ashDrawEx.shape.node.basic.Diamond",

		DEFAULT_COLOR : new ashDraw.util.Color("#4D90FE"),
		
		"-chains-": {
	        constructor: "manual"
	    },
		constructor: function() {
			this.inherited(arguments, [60, 60]);
			this.createPort("input");
	        this.createPort("output");

	        this.setBackgroundColor(this.DEFAULT_COLOR);
	        this.setColor(this.DEFAULT_COLOR.darker());
	    },
	    
	    getPersistentAttributes : function(){
	        var memento = this.inherited(arguments);
	        memento.gId = this.gId;
	        memento.dx = this.dx;
	        memento.dy = this.dy;        
	        return memento;
	    },
	    
	    setPersistentAttributes : function(memento){
	        this.inherited(arguments, [memento]);
	        this.gId = memento.gId;
	        this.dx = memento.dx;
	        this.dy = memento.dy;
	    }
	});
});
