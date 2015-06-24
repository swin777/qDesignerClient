dojo.declare("ashDraw.io.json.Reader", ashDraw.io.Reader, {
	"-chains-": {
        constructor: "manual"
    },
	constructor: function() {
		this.inherited(arguments);
    },
    
    unmarshal: function(canvas, json){
        var node=null;
        var cnt = 0;
        $.each(json, function(i, element){
        	cnt++;
            var o = eval("new "+element.type+"()");
            if(o instanceof ashDraw.Connection){
        		o.setTargetDecorator(new ashDraw.decoration.connection.ArrowDecorator());
        	}
            var source= null;
            var target=null;
            for(i in element){
                var val = element[i];
                if(i === "source"){
                    node = canvas.getFigure(val.node);
                    source = node.getPort(val.port);
                }
                else if (i === "target"){
                    node = canvas.getFigure(val.node);
                    target = node.getPort(val.port);
                }
            }
            if(source!==null && target!==null){
                o.setSource(source);
                o.setTarget(target);
            }
            o.setPersistentAttributes(element);
            canvas.addFigure(o);
            if(json.length==cnt){
            	Designer.app.eventbus.fireEvent('unmarshalComplete', canvas);
            }
        });
    }
});