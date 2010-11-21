/*
Copyright (c) 2010, R. Kowalski
All rights reserved.


Redistribution and use in source and binary forms, 
with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, 
  this list of conditions and the following disclaimer.
  
* Redistributions in binary form must reproduce the above copyright notice, 
  this list of conditions and the following disclaimer in the documentation and/or other materials provided 
  with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, 
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING 
IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

function Day1Assistant() {
}

Day1Assistant.prototype.setup = function() {
    
     this.controller.setupWidget("saal1",
         this.attributes = {
             },
         this.model = {
             label : "Saal 1",
             disabled: false
         }
     );
     this.controller.setupWidget("saal2",
         this.attributes = {
             },
         this.model = {
             label : "Saal 2",
             disabled: false
         }
     );
     this.controller.setupWidget("saal3",
         this.attributes = {
             },
         this.model = {
             label : "Saal 3",
             disabled: false
         }
     );
     var text = Fahrplan.data;
     var day = 0;
     var room = 0; 
     
     for(var i in text[day][room]){
         Mojo.Log.error(i);
         Mojo.Log.error(text[day][room][i].title);
         
     }
     Mojo.Log.error(text[day].dayends);
     for(var i = 690; i<=text[day].dayends; i = i+15){
         var tr = '<tr> <td><td> </tr>';
         try {
             titletext[day][room][i].start;
         }catch(e){
             
         }
     }

 //    this.controller.get('test').update(test);		


/*     
    this.openSaal = this.openSaal.bindAsEventListener(this); //PRE-CACHE//	
    Mojo.Event.listen(this.controller.get('saal1'), Mojo.Event.tap, this.openSaal('1'));
	Mojo.Event.listen(this.controller.get('saal2'), Mojo.Event.tap, this.openSaal('2'));
	Mojo.Event.listen(this.controller.get('saal3'), Mojo.Event.tap, this.openSaal('3'));
*/	
}

Day1Assistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


Day1Assistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

Day1Assistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
