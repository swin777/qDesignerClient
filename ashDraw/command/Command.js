define(["dojo/_base/declare"], function(declare){
	return declare("ashDraw.command.Command", null, {
	    NAME : "ashDraw.command.Command", 

	    constructor: function( label) {
	        this.label = label;
	    },
	   
	    getLabel:function(){
	       return this.label;
	    },
	    
	  
	    canExecute:function(){
	      return true;
	    },
	    
	    execute:function(){
	    },
	    
	    cancel:function(){
	    },
	    
	    undo:function(){
	    },
	    
	    redo:function(){
	    },
	    
	    groupAdminByAdd:function(){
	    	var arr = this.figure.getCanvas().getFigures().data;
	        var genArr = [];
	        var grpArr = [];
	        for(var i=0; i<arr.length; i++){
	     	   if(arr[i] && this.figure.id!=arr[i].id){
	     		   var fi = arr[i];
	     		   if(fi instanceof hatio.shape.node.basic.Group){
	     			   grpArr.push(fi);
	     		   }else{
	     			   genArr.push(fi);
	     		   }
	     	   }
	        }
	        if(this.figure instanceof hatio.shape.node.basic.Group){
	     	   this.figure.shape.toBack();
	     	   for(var i=0; i<genArr.length; i++){
	     		   this.figure.containTest(genArr[i]);
	     	   }
	        }else{
	     	   for(var i=0; i<grpArr.length; i++){
	     		   if(grpArr[i].containTest(this.figure)){
	     			  return;
	     		   }
	     	   }
	        }
	    },
	    
	    groupAdminByRemove:function(){
	    	try{
	    		if(this.figure instanceof hatio.shape.node.basic.Group){
	            	var arr = this.figure.getCanvas().getFigures().data;
	            	for(var i=0; i<arr.length; i++){
	            		if(arr[i].gId == this.id){
	            			arr[i].gId = null;
	            			arr[i].dx = 0;
	            			arr[i].dy = 0;
	            		}
	            	}
	            }else{
	            	if(this.figure.gId){
	            		var groupFigure = this.searchGroupFigure(this.figure.gId);
	            		var customChildren = groupFigure.customChildren;
	            		var delIndex = 0;
	        			for(var i=0; i<customChildren.length; i++){
	        				if(this.figure.id == customChildren[i].id){
	        					delIndex = i;
	        					break;
	        				}
	        			}
	        			groupFigure.customChildren.splice(delIndex,1);
	            	}
	            }
	    	}catch(e){}
	    },
	    
	    groupAdminByMove:function(){
	    	var arr = this.figure.getCanvas().getFigures().data;
	    	if(this.figure instanceof hatio.shape.node.basic.Group){
	    		for(var i=0; i<arr.length; i++){
	    			var fi = arr[i];
	    			if(fi && !(fi instanceof hatio.shape.node.basic.Group) && !(fi.gId)){
	    				this.figure.containTest(fi);
	    			}
	    		}
	    	}else{
	    		for(var i=0; i<arr.length; i++){
	    			var fi = arr[i];
	    			if(fi instanceof hatio.shape.node.basic.Group){
	    				if(fi.containTest(this.figure)){
	    					return;
	    	     		}
	    			}
	    		}
	    		if(this.figure.gId){
	    			var groupFigure = this.searchGroupFigure(this.figure.gId);
	    			var customChildren = groupFigure.customChildren;
	    			var delIndex = 0;
	    			for(var i=0; i<customChildren.length; i++){
	    				if(this.figure.id == customChildren[i].id){
	    					delIndex = i;
	    					break;
	    				}
	    			}
	    			groupFigure.customChildren.splice(delIndex,1);
	    			this.figure.gId = null;
	        		this.figure.dx = 0;
	        		this.figure.dy = 0;
	    		}
	    	}
	    },
	    
	    groupAdminByResize:function(){
	    	this.groupAdminByMove();
	    },
	    
	    searchGroupFigure:function(gId){
	    	var arr = this.figure.getCanvas().getFigures().data;
	    	for(var i=0; i<arr.length; i++){
	    		var figure = arr[i];
	    		if(figure instanceof hatio.shape.node.basic.Group && figure.id==gId){
	    			return figure;
	    		}
	    	}
	    }
	});
});