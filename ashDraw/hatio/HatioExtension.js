var hatio = {
	shape : {
		node : {
			basic : {
			},
			chart : {
			}
		}
	}
};

$LAB
.script(ashDrawPath + "hatio/MyInputPortLocator.js")
.script(ashDrawPath + "hatio/MyOutputPortLocator.js")
.script(ashDrawPath + "hatio/CustomNodeRepository.js")
.script(ashDrawPath + "hatio/HatioCanvas.js")
.script(ashDrawPath + "hatio/VolatilePort.js")
.script(ashDrawPath + "hatio/shape/node/basic/Circle.js")
.script(ashDrawPath + "hatio/shape/node/basic/Oval.js")
.script(ashDrawPath + "hatio/shape/node/basic/Diamond.js")
.script(ashDrawPath + "hatio/shape/node/basic/Rectangle.js")
.script(ashDrawPath + "hatio/shape/node/basic/Image.js")
.script(ashDrawPath + "hatio/shape/node/basic/Label.js")
.script(ashDrawPath + "hatio/shape/node/basic/SampleFigure.js")
.script(ashDrawPath + "hatio/shape/node/basic/SampleFigure2.js")
.script(ashDrawPath + "hatio/shape/node/basic/CustomSvgFigure.js")
.script(ashDrawPath + "hatio/shape/node/basic/CustomImgFigure.js")
.script(ashDrawPath + "hatio/shape/node/basic/Group.js")
.script(ashDrawPath + "hatio/HatioMonitorCanvas.js").wait(function(){
            hatioGraphtiLoaded();
        });