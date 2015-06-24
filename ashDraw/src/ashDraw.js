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
    ashDrawPath = "../../";
}

// loading the lib
//
$LAB
.script(ashDrawPath+"src/util/Color.js")
.script(ashDrawPath+"src/util/ArrayList.js")
.script(ashDrawPath+"src/util/UUID.js")
.script(ashDrawPath+"src/geo/PositionConstants.js")
.script(ashDrawPath+"src/geo/Point.js")
.script(ashDrawPath+"src/geo/Rectangle.js")

.script(ashDrawPath+"src/command/CommandType.js")
.script(ashDrawPath+"src/command/Command.js")
.script(ashDrawPath+"src/command/CommandStack.js")
.script(ashDrawPath+"src/command/CommandStackEvent.js")
.script(ashDrawPath+"src/command/CommandStackEventListener.js")
.script(ashDrawPath+"src/command/CommandMove.js")
.script(ashDrawPath+"src/command/CommandResize.js")
.script(ashDrawPath+"src/command/CommandConnect.js")
.script(ashDrawPath+"src/command/CommandReconnect.js")
.script(ashDrawPath+"src/command/CommandDelete.js")
.script(ashDrawPath+"src/command/CommandAdd.js")
.script(ashDrawPath+"src/command/CommandReLabel.js")

.script(ashDrawPath+"src/layout/connection/ConnectionRouter.js")
.script(ashDrawPath+"src/layout/connection/DirectRouter.js")
.script(ashDrawPath+"src/layout/connection/ManhattanConnectionRouter.js")
.script(ashDrawPath+"src/layout/connection/ManhattanBridgedConnectionRouter.js")
.script(ashDrawPath+"src/layout/connection/BezierConnectionRouter.js")

.script(ashDrawPath+"src/layout/locator/Locator.js")
.script(ashDrawPath+"src/layout/locator/PortLocator.js")
.script(ashDrawPath+"src/layout/locator/InputPortLocator.js")
.script(ashDrawPath+"src/layout/locator/OutputPortLocator.js")
.script(ashDrawPath+"src/layout/locator/ConnectionLocator.js")
.script(ashDrawPath+"src/layout/locator/ManhattanMidpointLocator.js")
.script(ashDrawPath+"src/layout/locator/TopLocator.js")
.script(ashDrawPath+"src/layout/locator/BottomLocator.js")
.script(ashDrawPath+"src/layout/locator/LeftLocator.js")
.script(ashDrawPath+"src/layout/locator/RightLocator.js")
.script(ashDrawPath+"src/layout/locator/CenterLocator.js")

.script(ashDrawPath+"src/policy/EditPolicy.js")
.script(ashDrawPath+"src/policy/DragDropEditPolicy.js")
.script(ashDrawPath+"src/policy/RegionEditPolicy.js")
.script(ashDrawPath+"src/policy/HorizontalEditPolicy.js")
.script(ashDrawPath+"src/policy/VerticalEditPolicy.js")

.script(ashDrawPath+"src/Canvas.js")
.script(ashDrawPath+"src/Figure.js")
.script(ashDrawPath+"src/shape/node/Node.js")
.script(ashDrawPath+"src/VectorFigure.js")
.script(ashDrawPath+"src/shape/basic/Rectangle.js")
.script(ashDrawPath+"src/SetFigure.js")
.script(ashDrawPath+"src/SVGFigure.js").wait()

.script(ashDrawPath+"src/shape/basic/Oval.js")
.script(ashDrawPath+"src/shape/basic/Circle.js")
.script(ashDrawPath+"src/shape/basic/Label.js")
.script(ashDrawPath+"src/shape/basic/Line.js")
.script(ashDrawPath+"src/shape/basic/PolyLine.js")
.script(ashDrawPath+"src/shape/basic/Diamond.js")
.script(ashDrawPath+"src/shape/basic/Image.js")
.script(ashDrawPath+"src/Connection.js")
.script(ashDrawPath+"src/VectorFigure.js")
.script(ashDrawPath+"src/ResizeHandle.js")
.script(ashDrawPath+"src/LineResizeHandle.js")
.script(ashDrawPath+"src/LineStartResizeHandle.js")
.script(ashDrawPath+"src/LineEndResizeHandle.js")
.script(ashDrawPath+"src/Port.js").wait()
.script(ashDrawPath+"src/InputPort.js")
.script(ashDrawPath+"src/OutputPort.js")
.script(ashDrawPath+"src/HybridPort.js")
.script(ashDrawPath+"src/layout/anchor/ConnectionAnchor.js")
.script(ashDrawPath+"src/layout/anchor/ChopboxConnectionAnchor.js")
.script(ashDrawPath+"src/layout/anchor/ShortesPathConnectionAnchor.js")

.script(ashDrawPath+"src/decoration/connection/Decorator.js")
.script(ashDrawPath+"src/decoration/connection/ArrowDecorator.js")
.script(ashDrawPath+"src/decoration/connection/DiamondDecorator.js")
.script(ashDrawPath+"src/decoration/connection/CircleDecorator.js")
.script(ashDrawPath+"src/decoration/connection/BarDecorator.js")

.script(ashDrawPath+"src/io/Reader.js")
.script(ashDrawPath+"src/io/Writer.js")
.script(ashDrawPath+"src/io/svg/Writer.js")
.script(ashDrawPath+"src/io/png/Writer.js")
.script(ashDrawPath+"src/io/json/Writer.js")
.script(ashDrawPath+"src/io/json/Reader.js").wait(
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
