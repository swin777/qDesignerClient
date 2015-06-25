var ashDraw = { 
    isTouchDevice : (
            //Detect iPhone
            (navigator.platform.indexOf("iPhone") != -1) ||
            //Detect iPod
            (navigator.platform.indexOf("iPod") != -1)||
            //Detect iPad
            (navigator.platform.indexOf("iPad") != -1)
        )   
};

require(dojoConfig, [
						"ashDrawEx/shape/node/basic/Circle",
						"ashDrawEx/shape/node/basic/CustomImgFigure",
						"ashDrawEx/shape/node/basic/CustomSvgFigure",
						"ashDrawEx/shape/node/basic/Diamond",
						"ashDrawEx/shape/node/basic/Group",
						"ashDrawEx/shape/node/basic/Image",
						"ashDrawEx/shape/node/basic/Label",
						"ashDrawEx/shape/node/basic/Oval",
						"ashDrawEx/shape/node/basic/Rectangle",
						"ashDrawEx/shape/node/basic/SampleFigure",
						"ashDrawEx/shape/node/basic/SampleFigure2",
						"ashDrawEx/CustomNodeRepository",
						"ashDrawEx/ExCanvas",
						"ashDrawEx/MyInputPortLocator",
						"ashDrawEx/MyOutputPortLocator",
						"ashDrawEx/VolatilePort",
                     ], ashDrawLoaded()
);

Math.sign = function()
{
 if (this < 0) {return -1;}
 return 1;
};
