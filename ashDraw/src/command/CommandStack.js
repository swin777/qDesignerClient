dojo.declare("ashDraw.command.CommandStack", null, {
    NAME : "ashDraw.command.CommandStack", 
    
    "-chains-": {
        constructor: "manual"
    },
    
    constructor: function() {
    	this.undostack = [];
        this.redostack = [];
        this.maxundo = 50;
        this.eventListeners = new ashDraw.util.ArrayList();
    },
    
    setUndoLimit:function( count){
      this.maxundo = count;
    },
    
    markSaveLocation:function(){
       this.undostack = [];
       this.redostack = [];
    },
    
    execute:function(command){
       // nothing to do
       if(command===null)
          return; //silently
    
       if(typeof command === "undefined")
          throw "Missing parameter [command] for method call CommandStack.execute";
          
       if(command.canExecute()===false)
          return;
    
       this.notifyListeners(command, ashDraw.command.CommandStack.PRE_EXECUTE);
    
       this.undostack.push(command);
       command.execute();
    
       this.redostack = [];
   
       if(this.undostack.length > this.maxundo){
          this.undostack = this.undostack.slice(this.undostack.length-this.maxundo);
       }
       this.notifyListeners(command, ashDraw.command.CommandStack.POST_EXECUTE);
    },
    
    undo:function(){
       var command = this.undostack.pop();
       if(command){
          this.notifyListeners(command, ashDraw.command.CommandStack.PRE_UNDO);
          this.redostack.push(command);
          command.undo();
          this.notifyListeners(command, ashDraw.command.CommandStack.POST_UNDO);
       }
    },
    
    
    redo:function(){
       var command = this.redostack.pop();
       if(command){
          this.notifyListeners(command, ashDraw.command.CommandStack.PRE_REDO);
          this.undostack.push(command);
          command.redo();
          this.notifyListeners(command, ashDraw.command.CommandStack.POST_REDO);
       }
    },
    
    getRedoLabel:function(){
       if(this.redostack.lenght===0)
         return "";
         
       var command = this.redostack[this.redostack.length-1];
       if(command){
          return command.getLabel();
       }
       return "";
    },
    
    getUndoLabel:function(){
       if(this.undostack.lenght===0)
         return "";
         
       var command = this.undostack[this.undostack.length-1];
    
       if(command){
          return command.getLabel();
       }
       return "";
    },
    
    canRedo:function(){
       return this.redostack.length>0;
    },
    
    canUndo:function(){
       return this.undostack.length>0;
    },
    
    addEventListener:function( listener){
        if(listener instanceof ashDraw.command.CommandStackEventListener){
          this.eventListeners.add(listener);
        }
        else if(typeof listener.stackChanged ==="function"){
          this.eventListeners.add(listener);
        }
        else if(typeof listener === "function"){
          this.eventListeners.add( {  stackChanged : listener });
        }
        else{
          throw "Object doesn't implement required callback interface [ashDraw.command.CommandStackListener]";
        }
    },
    
    removeEventListener:function(listener){
        for (var i = 0; i < size; i++){
            var entry = this.eventListeners.get(i);
            if(entry ===listener || entry.stackChanged === listener){
                this.eventListeners.remove(entry);
                return;
            }
         }
    },
        
    notifyListeners:function(command,  state){
      var event = new ashDraw.command.CommandStackEvent(this, command, state);
      var size = this.eventListeners.getSize();
      for (var i = 0; i < size; i++)
         this.eventListeners.get(i).stackChanged(event);
    }
});


ashDraw.command.CommandStack.PRE_EXECUTE=1;
ashDraw.command.CommandStack.PRE_REDO=2;
ashDraw.command.CommandStack.PRE_UNDO=4;
ashDraw.command.CommandStack.POST_EXECUTE=8;
ashDraw.command.CommandStack.POST_REDO=16;
ashDraw.command.CommandStack.POST_UNDO=32;

ashDraw.command.CommandStack.POST_MASK = ashDraw.command.CommandStack.POST_EXECUTE | ashDraw.command.CommandStack.POST_UNDO | ashDraw.command.CommandStack.POST_REDO;
ashDraw.command.CommandStack.PRE_MASK  = ashDraw.command.CommandStack.PRE_EXECUTE  | ashDraw.command.CommandStack.PRE_UNDO  |ashDraw.command.CommandStack.PRE_REDO;