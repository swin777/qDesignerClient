Ext.define('Designer.view.notation.NotationNode', {

	extend : 'Ext.Component',
	
	alias : 'widget.notation_node',
	
	nodeInfo : null,
	
	initComponent : function() {
		this.id = this.nodeInfo.id;
		this.html = this.getNodeDiv();
		//Designer.app.customNodeRepo.addCustomNode(this.nodeInfo);
		this.callParent(arguments);
	},
	
	getNodeDiv : function() {
		if("SVG" == this.nodeInfo.node_type) {
			var div = "<div data-shape='" + this.nodeInfo.cls_name + "' data-node-id='" + this.nodeInfo.id + "' class='navigation svg_palette_node_element ashDraw_droppable'>";
			div += this.nodeInfo.shape_data;
			div += "</div>";
			return div;
			
		} else if("Node" == this.nodeInfo.node_type) {
			var div = "<div data-shape='" + this.nodeInfo.cls_name + "' data-node-id='" + this.nodeInfo.id + "' class='navigation palette_node_element ashDraw_droppable'>";
			div += this.nodeInfo.name;
			div += "</div>";
			return div;
		}
	},
	
	createFigure : function() {
		if("SVG" == this.nodeInfo.node_type) {
			figure = new hatio.shape.node.basic.CustomSvgFigure(this.nodeInfo.id, this.nodeInfo.shape_width, this.nodeInfo.shape_height);
		} else if("Node" == this.nodeInfo.node_type) {
			figure = eval("new " + this.nodeInfo.cls_name + "();");
		}
		return figure;
	}
});