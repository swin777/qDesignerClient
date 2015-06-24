var ashDraw = 
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

if(typeof ashDrawPath === "undefined"){
    ashDrawPath = "../";
}

// loading the lib
//
require(dojoConfig, [
                     "ashDraw/shape/node/Node",
                     "ashDraw/command/CommandType",
                     "ashDraw/command/CommandStack",
                     "ashDraw/command/CommandMove",
                     "ashDraw/command/CommandResize",
                     "ashDraw/command/CommandConnect",
                     "ashDraw/command/CommandReconnect",
                     "ashDraw/command/CommandDelete",
                     "ashDraw/command/CommandAdd",
                     "ashDraw/command/CommandReLabel"
                     ], function(){LABLoad();}
);

function LABLoad(){
	$LAB
	.script(ashDrawPath+"util/Color.js")
	.script(ashDrawPath+"util/ArrayList.js")
	.script(ashDrawPath+"util/UUID.js")
	.script(ashDrawPath+"geo/PositionConstants.js")
	.script(ashDrawPath+"geo/Point.js")
	.script(ashDrawPath+"geo/Rectangle.js")

	.script(ashDrawPath+"layout/connection/ConnectionRouter.js")
	.script(ashDrawPath+"layout/connection/DirectRouter.js")
	.script(ashDrawPath+"layout/connection/ManhattanConnectionRouter.js")
	.script(ashDrawPath+"layout/connection/ManhattanBridgedConnectionRouter.js")
	.script(ashDrawPath+"layout/connection/BezierConnectionRouter.js")

	.script(ashDrawPath+"layout/locator/Locator.js")
	.script(ashDrawPath+"layout/locator/PortLocator.js")
	.script(ashDrawPath+"layout/locator/InputPortLocator.js")
	.script(ashDrawPath+"layout/locator/OutputPortLocator.js")
	.script(ashDrawPath+"layout/locator/ConnectionLocator.js")
	.script(ashDrawPath+"layout/locator/ManhattanMidpointLocator.js")
	.script(ashDrawPath+"layout/locator/TopLocator.js")
	.script(ashDrawPath+"layout/locator/BottomLocator.js")
	.script(ashDrawPath+"layout/locator/LeftLocator.js")
	.script(ashDrawPath+"layout/locator/RightLocator.js")
	.script(ashDrawPath+"layout/locator/CenterLocator.js")

	.script(ashDrawPath+"policy/EditPolicy.js")
	.script(ashDrawPath+"policy/DragDropEditPolicy.js")
	.script(ashDrawPath+"policy/RegionEditPolicy.js")
	.script(ashDrawPath+"policy/HorizontalEditPolicy.js")
	.script(ashDrawPath+"policy/VerticalEditPolicy.js")

	.script(ashDrawPath+"Canvas.js")
	.script(ashDrawPath+"VectorFigure.js")
	.script(ashDrawPath+"shape/basic/Rectangle.js")
	.script(ashDrawPath+"SetFigure.js")
	.script(ashDrawPath+"SVGFigure.js").wait()

	.script(ashDrawPath+"shape/basic/Oval.js")
	.script(ashDrawPath+"shape/basic/Circle.js")
	.script(ashDrawPath+"shape/basic/Label.js")
	.script(ashDrawPath+"shape/basic/Line.js")
	.script(ashDrawPath+"shape/basic/PolyLine.js")
	.script(ashDrawPath+"shape/basic/Diamond.js")
	.script(ashDrawPath+"shape/basic/Image.js")
	.script(ashDrawPath+"Connection.js")
	.script(ashDrawPath+"VectorFigure.js")
	.script(ashDrawPath+"ResizeHandle.js")
	.script(ashDrawPath+"LineResizeHandle.js")
	.script(ashDrawPath+"LineStartResizeHandle.js")
	.script(ashDrawPath+"LineEndResizeHandle.js")
	.script(ashDrawPath+"Port.js").wait()
	.script(ashDrawPath+"InputPort.js")
	.script(ashDrawPath+"OutputPort.js")
	.script(ashDrawPath+"HybridPort.js")
	.script(ashDrawPath+"layout/anchor/ConnectionAnchor.js")
	.script(ashDrawPath+"layout/anchor/ChopboxConnectionAnchor.js")
	.script(ashDrawPath+"layout/anchor/ShortesPathConnectionAnchor.js")

	.script(ashDrawPath+"decoration/connection/Decorator.js")
	.script(ashDrawPath+"decoration/connection/ArrowDecorator.js")
	.script(ashDrawPath+"decoration/connection/DiamondDecorator.js")
	.script(ashDrawPath+"decoration/connection/CircleDecorator.js")
	.script(ashDrawPath+"decoration/connection/BarDecorator.js")

	.script(ashDrawPath+"io/Reader.js")
	.script(ashDrawPath+"io/Writer.js")
	.script(ashDrawPath+"io/svg/Writer.js")
	.script(ashDrawPath+"io/png/Writer.js")
	.script(ashDrawPath+"io/json/Writer.js")
	.script(ashDrawPath+"io/json/Reader.js").wait(
	function(){
		var link = $("<link>");
		link.attr({
		        type: 'text/css',
		        rel: 'stylesheet'/*,
		        href: ashDrawPath+"css/contextmenu.css"*/
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
		ashDrawLoaded();
		}catch(exc){
		    console.log(exc);
		}
	});
}


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
