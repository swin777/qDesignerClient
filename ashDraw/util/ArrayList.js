define(["dojo/_base/declare"], function(declare){
	var ArrayList = declare("ashDraw.util.ArrayList", null, {
		constructor: function( ) {
	        this.increment = 10;
	        
	        this.size = 0;
	        this.data = new Array(this.increment);        
	    },
	    
	     reverse:function(){
	        var newData = new Array(this.size);
	        for (var i=0; i<this.size; i++)
	        {
	           newData[i] = this.data[this.size-i-1];
	        }
	        this.data = newData;
	        
	        return this;
	     },
	    
	     getCapacity:function() {
	        return this.data.length;
	     },
	    
	     getSize:function() {
	        return this.size;
	     },
	    
	     isEmpty:function() {
	        return this.getSize() === 0;
	     },
	   
	     getLastElement:function() {
	        if (this.data[this.getSize() - 1] !== null) {
	           return this.data[this.getSize() - 1];
	        }
	        return null;
	     },
	    
	     asArray:function() {
	       this.trimToSize();
	       return this.data;
	     },
	    
	     getFirstElement:function() {
	        if (this.data[0] !== null && typeof this.data[0] !=="undefined") {
	           return this.data[0];
	        }
	        return null;
	     },
	    
	     get:function(i){
	        return this.data[i];
	     },

	    
	     add:function(obj){
	        if(this.getSize() == this.data.length) 
	        {
	           this.resize();
	        }
	        this.data[this.size++] = obj;
	        
	        return this;
	     },
	     
	     addAll:function(list){
	        if(!(list instanceof ashDraw.util.ArrayList)){
	          throw "Unable to handle unknown object type in ArrayList.addAll";
	        }

	        for (var i=0;i<list.getSize(); i++)
	        {
	           this.add(list.get(i));
	        }
	        return this;
	     },
	    
	     remove:function( obj){
	        var index = this.indexOf(obj);
	        if(index>=0)
	         return this.removeElementAt(index);
	        
	        return null;
	     },

	     insertElementAt:function(obj, index) 
	     {
	        if (this.size == this.capacity) 
	        {
	           this.resize();
	        }
	        
	        for (var i=this.getSize(); i > index; i--) 
	        {
	           this.data[i] = this.data[i-1];
	        }
	        this.data[index] = obj;
	        this.size++;
	        
	        return this;
	     },

	     removeElementAt:function(index)
	     {
	        var element = this.data[index];
	    
	        for(var i=index; i<(this.getSize()-1); i++)
	        {
	           this.data[i] = this.data[i+1];
	        }
	    
	        this.data[this.getSize()-1] = null;
	        this.size--;
	        
	        return element;
	     },

	     removeAllElements:function()
	     {
	        this.size = 0;
	    
	        for (var i=0; i<this.data.length; i++) 
	        {
	           this.data[i] = null;
	        }
	        
	        return this;
	     },
	    
	     indexOf:function(obj)
	     {
	        for (var i=0; i<this.getSize(); i++) 
	        {
	           if (this.data[i] == obj) 
	           {
	              return i;
	           }
	        }
	        return -1;
	     },

	     contains:function(obj) 
	     {
	        for (var i=0; i<this.getSize(); i++) 
	        {
	           if (this.data[i] == obj)
	           {
	              return true;
	           }
	        }
	        return false;
	     },
	    
	     // resize() -- increases the size of the Vector
	     resize:function()
	     {
	        newData = new Array(this.data.length + this.increment);
	    
	        for   (var i=0; i< this.data.length; i++) 
	        {
	           newData[i] = this.data[i];
	        }
	    
	        this.data = newData;
	        
	        return this;
	     },
	    
	    
	     // trimToSize() -- trims the vector down to it's size
	     trimToSize:function()
	     {
	        // nothing to do
	        if(this.data.length == this.size)
	           return this;
	    
	        var temp = new Array(this.getSize());
	    
	        for (var i = 0; i < this.getSize(); i++) 
	        {
	           temp[i] = this.data[i];
	        }
	        this.size = temp.length;
	        this.data = temp;
	        
	        return this;
	     }, 
	    
	     sort:function(f) 
	     {
	        var i, j;
	        var currentValue;
	        var currentObj;
	        var compareObj;
	        var compareValue;
	    
	        for(i=1; i<this.getSize();i++) 
	        {
	           currentObj = this.data[i];
	           currentValue = currentObj[f];
	    
	           j= i-1;
	           compareObj = this.data[j];
	           compareValue = compareObj[f];
	    
	           while(j >=0 && compareValue > currentValue) 
	           {
	              this.data[j+1] = this.data[j];
	              j--;
	              if (j >=0) {
	                       compareObj = this.data[j];
	                       compareValue = compareObj[f];
	              }
	           }
	           this.data[j+1] = currentObj;
	        }
	        
	        return this;
	     },
	    
	     clone:function() 
	     {
	        var newVector = new ashDraw.util.ArrayList(this.size);
	    
	        for (var i=0; i<this.size; i++) {
	           newVector.add(this.data[i]);
	        }
	    
	        return newVector;
	     },
	    
	      each:function(func) 
	      {
	         if(typeof func !== "function"){
	             throw "parameter must type of 'function'";
	         }
	         
	         var s= this.getSize();
	         for (var i=0; i<s; i++) 
	         {
	            if(func(i, this.data[i])===false)
	                break;
	         }
	      },
	     
	     // overwriteElementAt() - overwrites the element with an object at the specific index.
	     overwriteElementAt:function(obj, index) 
	     {
	        this.data[index] = obj;
	        
	        return this;
	     },
	    
	     getPersistentAttributes:function()
	     {
	        return {
	               data: this.data,
	               increment: this.increment,
	               size: this.getSize()
	               };
	     },
	     
	     setPersistentAttributes : function(memento)
	     {
	         this.data = memento.data;
	         this.increment = memento.increment;
	         this.size = memento.size;
	     }
	});
	ArrayList.EMPTY_LIST = new ashDraw.util.ArrayList();
	return ArrayList
});