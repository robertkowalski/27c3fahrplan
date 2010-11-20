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
     var text = Fahrplan.data.evalJSON(true);
     
     //calculatate values like 11:30 into minutes from 00:00
     function calculateMinutes(time) {
         this.time = time.split(':');
         var split, tmp, result;
         tmp = Number(this.time[0])*60;
         result = tmp + Number(this.time[1]);

         return result;
     }
     function calculateStartEnding(minutes) {
         this.minutes = Number(minutes);
         if(this.minutes < 240) {
             result = this.minutes+1440;
         } else {
             result = this.minutes;  
         }
         return result;  
     }
     function sortObj(arr){
    	// Setup Arrays
    	var sortedKeys = new Array();
    	var sortedObj = {};
        this.arr = arr;
    	// Separate keys and sort them
    	for (var i in this.arr){
    		sortedKeys.push(i);
    	}
    	sortedKeys.sort();
    
    	// Reconstruct sorted obj based on keys
    	for (var i in sortedKeys){
    		sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
    	}
    	return sortedObj;
    }  
    function chooseColor(track){
        var color;
        this.track = track;
        
//        'Community'   // khaki
//        'Society'     // moccasin
//        'Hacking'     // lightgreen
//        'Culture'     // plum
//         event =      // #C1C1C1
//        'Make'
//        'Science'

		switch (this.track) {
            case 'Community':
                color = 'khaki';
                break;
            case 'Society':
                color = 'moccasin';
                break;
            case 'Hacking':
                color = 'lightgreen';
                break;
            case 'Culture':
                color = 'plum';
                break;
            default:
                color = '#C1C1C1';
        }
        return color
    }   
     
  
    // DAY&rooms //
    var day = 0;
    var rooms = 3;
     
    
    var timeTable = [];
    timeTable[0] = [];
    timeTable[1] = [];
    timeTable[2] = [];
    var minutesStart, minutesDuration, minutesEnding, minutesRealstart;
    
    for (var j=0; j<rooms; j++) {
        
        for (var i=0; i<text.day[day].room[j].event.length; i++) {
            /*        Mojo.Log.error(text.day[0]['room'][0]['event'][i]['start']);
         Mojo.Log.error(text.day[0]['room'][0]['event'][i]['duration']);
         Mojo.Log.error(text.day[0]['room'][0]['event'][i]['title']);
         Mojo.Log.error(text.day[0]['room'][0]['event'][i]['track']); //color
         Mojo.Log.error(text.day[0]['room'][0]['event'][i]['language']);
         Mojo.Log.error(text.day[0]['room'][0]['event'][i]['persons'].person);
         Mojo.Log.error(text.day[0]['room'][0]['event'][i]['duration']);
         */
            minutesStart = calculateMinutes(text.day[day].room[j].event[i].start);
            minutesDuration = calculateMinutes(text.day[day].room[j].event[i].duration);
            minutesEnding = calculateStartEnding(minutesStart + minutesDuration);
            minutesRealstart = calculateStartEnding(minutesStart);
            
            timeTable[j][minutesRealstart] = [];
            timeTable[j][minutesRealstart]['start'] = minutesRealstart; 
            timeTable[j][minutesRealstart]['duration'] = minutesDuration;
            timeTable[j][minutesRealstart]['end'] = minutesEnding;
            
            timeTable[j][minutesRealstart]['language'] = text.day[day].room[j].event[i].language;
            timeTable[j][minutesRealstart]['title'] = text.day[day].room[j].event[i].title;          
            timeTable[j][minutesRealstart]['subtitle'] = text.day[day].room[j].event[i].subtitle;
           
            timeTable[j][minutesRealstart]['track'] = chooseColor(text.day[day].room[j].event[i].track); 
  
        }
    }  
 
    var test = [];
    test[0] = sortObj(timeTable[1]);
    for (var k in test[0]){
        Mojo.Log.error(test[0][k]['track']);
    }
   
    
    //Duration / Slots 
    var test = '01:30'.split(':');
    var result = 0;
    var tmp = Number(test[0])*60;
    var result = tmp + Number(test[1]);  
    var slots = result / 4; 
    
     
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
