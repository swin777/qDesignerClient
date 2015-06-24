var graphiti = 
{
    geo: {
    },

    io:{
        json:{},
        png:{},
        svg:{}  
    },
    
    util : {
    },

    shape : {
    	basic:{},
        node: {},
    },
    
    policy : {
    },
    
    command : {
    },

    decoration:{
    	connection:{}
    }, 
    
    layout: {
        connection :{},
	    anchor :{},
	    locator: {}
    },
    
    isTouchDevice : (
            //Detect iPhone
            (navigator.platform.indexOf("iPhone") != -1) ||
            //Detect iPod
            (navigator.platform.indexOf("iPod") != -1)||
            //Detect iPad
            (navigator.platform.indexOf("iPad") != -1)
        )
    
};

if(typeof graphitiPath === "undefined"){
    graphitiPath = "../../";
}

// loading the lib
//
$LAB
.script(graphitiPath+"src/util/Color.js")
.script(graphitiPath+"src/util/ArrayList.js")
.script(graphitiPath+"src/util/UUID.js")
.script(graphitiPath+"src/geo/PositionConstants.js")
.script(graphitiPath+"src/geo/Point.js")
.script(graphitiPath+"src/geo/Rectangle.js")

.script(graphitiPath+"src/command/CommandType.js")
.script(graphitiPath+"src/command/Command.js")
.script(graphitiPath+"src/command/CommandStack.js")
.script(graphitiPath+"src/command/CommandStackEvent.js")
.script(graphitiPath+"src/command/CommandStackEventListener.js")
.script(graphitiPath+"src/command/CommandMove.js")
.script(graphitiPath+"src/command/CommandResize.js")
.script(graphitiPath+"src/command/CommandConnect.js")
.script(graphitiPath+"src/command/CommandReconnect.js")
.script(graphitiPath+"src/command/CommandDelete.js")
.script(graphitiPath+"src/command/CommandAdd.js")
.script(graphitiPath+"src/command/CommandReLabel.js")

.script(graphitiPath+"src/layout/connection/ConnectionRouter.js")
.script(graphitiPath+"src/layout/connection/DirectRouter.js")
.script(graphitiPath+"src/layout/connection/ManhattanConnectionRouter.js")
.script(graphitiPath+"src/layout/connection/ManhattanBridgedConnectionRouter.js")
.script(graphitiPath+"src/layout/connection/BezierConnectionRouter.js")

.script(graphitiPath+"src/layout/locator/Locator.js")
.script(graphitiPath+"src/layout/locator/PortLocator.js")
.script(graphitiPath+"src/layout/locator/InputPortLocator.js")
.script(graphitiPath+"src/layout/locator/OutputPortLocator.js")
.script(graphitiPath+"src/layout/locator/ConnectionLocator.js")
.script(graphitiPath+"src/layout/locator/ManhattanMidpointLocator.js")
.script(graphitiPath+"src/layout/locator/TopLocator.js")
.script(graphitiPath+"src/layout/locator/BottomLocator.js")
.script(graphitiPath+"src/layout/locator/LeftLocator.js")
.script(graphitiPath+"src/layout/locator/RightLocator.js")
.script(graphitiPath+"src/layout/locator/CenterLocator.js")

.script(graphitiPath+"src/policy/EditPolicy.js")
.script(graphitiPath+"src/policy/DragDropEditPolicy.js")
.script(graphitiPath+"src/policy/RegionEditPolicy.js")
.script(graphitiPath+"src/policy/HorizontalEditPolicy.js")
.script(graphitiPath+"src/policy/VerticalEditPolicy.js")

.script(graphitiPath+"src/Canvas.js")
.script(graphitiPath+"src/Figure.js")
.script(graphitiPath+"src/shape/node/Node.js")
.script(graphitiPath+"src/VectorFigure.js")
.script(graphitiPath+"src/shape/basic/Rectangle.js")
.script(graphitiPath+"src/SetFigure.js")
.script(graphitiPath+"src/SVGFigure.js").wait()

.script(graphitiPath+"src/shape/basic/Oval.js")
.script(graphitiPath+"src/shape/basic/Circle.js")
.script(graphitiPath+"src/shape/basic/Label.js")
.script(graphitiPath+"src/shape/basic/Line.js")
.script(graphitiPath+"src/shape/basic/PolyLine.js")
.script(graphitiPath+"src/shape/basic/Diamond.js")
.script(graphitiPath+"src/shape/basic/Image.js")
.script(graphitiPath+"src/Connection.js")
.script(graphitiPath+"src/VectorFigure.js")
.script(graphitiPath+"src/ResizeHandle.js")
.script(graphitiPath+"src/LineResizeHandle.js")
.script(graphitiPath+"src/LineStartResizeHandle.js")
.script(graphitiPath+"src/LineEndResizeHandle.js")
.script(graphitiPath+"src/Port.js").wait()
.script(graphitiPath+"src/InputPort.js")
.script(graphitiPath+"src/OutputPort.js")
.script(graphitiPath+"src/HybridPort.js")
.script(graphitiPath+"src/layout/anchor/ConnectionAnchor.js")
.script(graphitiPath+"src/layout/anchor/ChopboxConnectionAnchor.js")
.script(graphitiPath+"src/layout/anchor/ShortesPathConnectionAnchor.js")

.script(graphitiPath+"src/decoration/connection/Decorator.js")
.script(graphitiPath+"src/decoration/connection/ArrowDecorator.js")
.script(graphitiPath+"src/decoration/connection/DiamondDecorator.js")
.script(graphitiPath+"src/decoration/connection/CircleDecorator.js")
.script(graphitiPath+"src/decoration/connection/BarDecorator.js")

.script(graphitiPath+"src/io/Reader.js")
.script(graphitiPath+"src/io/Writer.js")
.script(graphitiPath+"src/io/svg/Writer.js")
.script(graphitiPath+"src/io/png/Writer.js")
.script(graphitiPath+"src/io/json/Writer.js")
.script(graphitiPath+"src/io/json/Reader.js").wait(
function(){
	var link = $("<link>");
	link.attr({
	        type: 'text/css',
	        rel: 'stylesheet'/*,
	        href: graphitiPath+"css/contextmenu.css"*/
	});
	$("head").append( link ); 

	// avoid iPad bounce effect during DragDrop
	//
    document.ontouchmove = function(e){e.preventDefault();};

    // hide context menu
    document.oncontextmenu = function() {return false;};
    
    
    // hacking RaphaelJS to support groups of elements
	//
	(function() {
	    Raphael.fn.group = function(f, g) {
	        var enabled = document.getElementsByTagName("svg").length > 0;
	        if (!enabled) {
	            // return a stub for VML compatibility
	            return {
	                add : function() {
	                    // intentionally left blank
	                }
	            };
	        }
	      var i;
	      this.svg = "http://www.w3.org/2000/svg";
	      this.defs = document.getElementsByTagName("defs")[f];
	      this.svgcanv = document.getElementsByTagName("svg")[f];
	      this.group = document.createElementNS(this.svg, "g");
	      for(i = 0;i < g.length;i++) {
	        this.group.appendChild(g[i].node);
	      }
	      this.svgcanv.appendChild(this.group);
	      this.group.translate = function(c, a) {
	        this.setAttribute("transform", "translate(" + c + "," + a + ") scale(" + this.getAttr("scale").x + "," + this.getAttr("scale").y + ")");
	      };
	      this.group.rotate = function(c, a, e) {
	        this.setAttribute("transform", "translate(" + this.getAttr("translate").x + "," + this.getAttr("translate").y + ") scale(" + this.getAttr("scale").x + "," + this.getAttr("scale").y + ") rotate(" + c + "," + a + "," + e + ")");
	      };
	      this.group.scale = function(c, a) {
	        this.setAttribute("transform", "scale(" + c + "," + a + ") translate(" + this.getAttr("translate").x + "," + this.getAttr("translate").y + ")");
	      };
	      this.group.push = function(c) {
	        this.appendChild(c.node);
	      };
	      this.group.getAttr = function(c) {
	        this.previous = this.getAttribute("transform") ? this.getAttribute("transform") : "";
	        var a = [], e, h, j;
	        a = this.previous.split(" ");
	        for(i = 0;i < a.length;i++) {
	          if(a[i].substring(0, 1) == "t") {
	            var d = a[i], b = [];
	            b = d.split("(");
	            d = b[1].substring(0, b[1].length - 1);
	            b = [];
	            b = d.split(",");
	            e = b.length === 0 ? {x:0, y:0} : {x:b[0], y:b[1]};
	          }else {
	            if(a[i].substring(0, 1) === "r") {
	              d = a[i];
	              b = d.split("(");
	              d = b[1].substring(0, b[1].length - 1);
	              b = d.split(",");
	              h = b.length === 0 ? {x:0, y:0, z:0} : {x:b[0], y:b[1], z:b[2]};
	            }else {
	              if(a[i].substring(0, 1) === "s") {
	                d = a[i];
	                b = d.split("(");
	                d = b[1].substring(0, b[1].length - 1);
	                b = d.split(",");
	                j = b.length === 0 ? {x:1, y:1} : {x:b[0], y:b[1]};
	              }
	            }
	          }
	        }
	        if(typeof e === "undefined") {
	          e = {x:0, y:0};
	        }
	        if(typeof h === "undefined") {
	          h = {x:0, y:0, z:0};
	        }
	        if(typeof j === "undefined") {
	          j = {x:1, y:1};
	        }
	        
	        if(c == "translate") {
	          var k = e;
	        }else {
	          if(c == "rotate") {
	            k = h;
	          }else {
	            if(c == "scale") {
	              k = j;
	            }
	          }
	        }
	        return k;
	      };
	      this.group.copy = function(el){
	         this.copy = el.node.cloneNode(true);
	         this.appendChild(this.copy);
	      };
	      return this.group;
	    };
	})();
	try{
	graphitiLoaded();
	}catch(exc){
	    console.log(exc);
	}
});

var _errorStack_=[];
function pushErrorStack(/*:Exception*/ e, /*:String*/ functionName)
{
  _errorStack_.push(functionName+"\n");
  /*re*/throw e;
}


Math.sign = function()
{
 if (this < 0) {return -1;}
 return 1;
};
