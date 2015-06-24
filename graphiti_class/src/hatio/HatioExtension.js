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
.script(graphitiPath + "src/hatio/CustomNodeRepository.js")
.script(graphitiPath + "src/hatio/HatioCanvas.js")
.script(graphitiPath + "src/hatio/VolatilePort.js")
.script(graphitiPath + "src/hatio/shape/node/basic/Circle.js")
.script(graphitiPath + "src/hatio/shape/node/basic/Oval.js")
.script(graphitiPath + "src/hatio/shape/node/basic/Diamond.js")
.script(graphitiPath + "src/hatio/shape/node/basic/Rectangle.js")
.script(graphitiPath + "src/hatio/shape/node/basic/Image.js")
.script(graphitiPath + "src/hatio/shape/node/basic/Label.js")
.script(graphitiPath + "src/hatio/shape/node/basic/SampleFigure.js")
.script(graphitiPath + "src/hatio/shape/node/basic/SampleFigure2.js")
.script(graphitiPath + "src/hatio/shape/node/basic/CustomSvgFigure.js")
.script(graphitiPath + "src/hatio/shape/node/basic/CustomImgFigure.js")
.script(graphitiPath + "src/hatio/shape/node/basic/Group.js")
.script(graphitiPath + "src/hatio/HatioMonitorCanvas.js").wait(function(){
            hatioGraphtiLoaded();
        });