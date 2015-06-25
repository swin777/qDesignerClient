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
	     		   if(fi && fi.contain){
	     			   grpArr.push(fi);
	     		   }else{
	     			   genArr.push(fi);
	     		   }
	     	   }
	        }
	        if(this.figure && this.figure.contain){
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
	    		if(this.figure && this.figure.contain){
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
	    	if(this.figure && this.figure.contain){
	    		for(var i=0; i<arr.length; i++){
	    			var fi = arr[i];
	    			if(fi && !fi.contain && !(fi.gId)){
	    				this.figure.containTest(fi);
	    			}
	    		}
	    	}else{
	    		for(var i=0; i<arr.length; i++){
	    			var fi = arr[i];
	    			if(fi && fi.contain){
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
	    		if(figure && figure.contain && figure.id==gId){
	    			return figure;
	    		}
	    	}
	    }
	});
});