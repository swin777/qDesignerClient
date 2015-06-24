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
.script(ashDrawPath + "src/hatio/MyInputPortLocator.js")
.script(ashDrawPath + "src/hatio/MyOutputPortLocator.js")
.script(ashDrawPath + "src/hatio/CustomNodeRepository.js")
.script(ashDrawPath + "src/hatio/HatioCanvas.js")
.script(ashDrawPath + "src/hatio/VolatilePort.js")
.script(ashDrawPath + "src/hatio/shape/node/basic/Circle.js")
.script(ashDrawPath + "src/hatio/shape/node/basic/Oval.js")
.script(ashDrawPath + "src/hatio/shape/node/basic/Diamond.js")
.script(ashDrawPath + "src/hatio/shape/node/basic/Rectangle.js")
.script(ashDrawPath + "src/hatio/shape/node/basic/Image.js")
.script(ashDrawPath + "src/hatio/shape/node/basic/Label.js")
.script(ashDrawPath + "src/hatio/shape/node/basic/SampleFigure.js")
.script(ashDrawPath + "src/hatio/shape/node/basic/SampleFigure2.js")
.script(ashDrawPath + "src/hatio/shape/node/basic/CustomSvgFigure.js")
.script(ashDrawPath + "src/hatio/shape/node/basic/CustomImgFigure.js")
.script(ashDrawPath + "src/hatio/shape/node/basic/Group.js")
.script(ashDrawPath + "src/hatio/HatioMonitorCanvas.js").wait(function(){
            hatioGraphtiLoaded();
        });