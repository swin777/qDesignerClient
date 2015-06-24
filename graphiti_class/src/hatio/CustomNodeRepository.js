hatio.CustomNodeRepository = Class.extend({

    /**
     * @constructor
     * Initializes a new instance of the ArrayList class that is empty and has
     * the default initial capacity.
     * 
     */
    init: function() {
    	var self = this;
		this.customNodeMap = {};
		$.ajax({
		    url: '/notation_nodes.json?status_eq=R',
		    type: 'GET',
		    async: false,
		    timeout: 36000,
		    dataType: 'text',
            success:function(obj) {
                 var nodeArr = JSON.parse(obj);
                 for(var i=0; i<nodeArr.length; i++){                 	
                 	var node = nodeArr[i];
					if(node.shape_data) {
						try {
							node.shape_data = Designer.util.Base64.decode(node.shape_data);
							self.addCustomNode(node);
						} catch(e) {
							errStr += "Error when load custom notations : " + err.message + "\n\n";
							console.error(errStr);
						}
					}
                 }
            }
		});
    },
    
	addCustomNode : function(customNode) {
		if(!this.customNodeMap[customNode.id]) {
			this.customNodeMap[customNode.id] = customNode;
		}
	},
	
	getCustomNode : function(id) {
		return this.customNodeMap[id];
	},
	
	getSvg : function(id) {
		var node = this.getCustomNode(id);
		if(!node) {
			return null;
		} else {
			return node.node_type == 'SVG' ? node.figure_data : null;
		}
	}

});