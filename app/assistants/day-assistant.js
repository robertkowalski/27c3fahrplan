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

function DayAssistant(response) {

	this.day = response.day;
	this.date = new Date();  
	
}

DayAssistant.prototype.setup = function() {
    
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

	this.text = Fahrplan.data.evalJSON(true);
	
	var emptyTimes = [];
	emptyTimes[this.day] = [];
	
	var countEmpty = 0;
	var room, i;
	for (room = 0; room < 3; room++) {
		emptyTimes[this.day][room] = [];		
		for (i = 0; i < this.text[this.day][room].length - 1; i++) {
			if (this.text[this.day][room][i].ending < this.text[this.day][room][i + 1].start) {
				emptyTimes[this.day][room][countEmpty] = [];
				emptyTimes[this.day][room][countEmpty].start = this.text[this.day][room][i].ending;
				emptyTimes[this.day][room][countEmpty].ending = this.text[this.day][room][i + 1].start;
				emptyTimes[this.day][room][countEmpty].persons = '';
				emptyTimes[this.day][room][countEmpty].language = '';
				emptyTimes[this.day][room][countEmpty].color = 'transparent';
				emptyTimes[this.day][room][countEmpty].track = '';
				emptyTimes[this.day][room][countEmpty].subtitle = '&nbsp;';
				emptyTimes[this.day][room][countEmpty].title = '&nbsp;';
				emptyTimes[this.day][room][countEmpty].duration = emptyTimes[this.day][room][countEmpty].ending - emptyTimes[this.day][room][countEmpty].start;
				emptyTimes[this.day][room][countEmpty].slots = emptyTimes[this.day][room][countEmpty].duration / 15;
				emptyTimes[this.day][room][countEmpty].humanstartend = '';
				emptyTimes[this.day][room][countEmpty].hourid = 'n';
				countEmpty++;
			}
			
		}
		countEmpty=0;
		this.text[this.day][room] = this.text[this.day][room].concat(emptyTimes[this.day][room]);
		
		this.text[this.day][room].sort(function(a, b){
			return a.start - b.start
		});
		for(var i=0; i<this.text[this.day][room].length; i++){
			this.text[this.day][room][i].duration = Number(this.text[this.day][room][i].duration)*3;
			if(this.text[this.day][room][i].duration > 200) {
				this.text[this.day][room][i].duration = 200;
			}
			
		}
	} //End Line 82

	this.chooseRoom = 0;
		
	this.title = this.controller.get('title');
	this.setTitle(this.chooseRoom);
	
	this.menuModel = {
            items: this.text[this.day][this.chooseRoom]
    };

    this.controller.setupWidget("TimeWidget", {
            itemTemplate: "day/day-row-template",
            listTemplate: "day/day-list-template",
            swipeToDelete: false, 
            renderLimit: 50,
            reorderable: false
        },this.menuModel);
	
	this.saal1 = this.controller.get('saal1');
	this.saal2 = this.controller.get('saal2');
	this.saal3 = this.controller.get('saal3');
	this.openSaal1 = this.handleTap.bind(this, this.saal1);
	this.openSaal2 = this.handleTap.bind(this, this.saal2);
	this.openSaal3 = this.handleTap.bind(this, this.saal3);
	Mojo.Event.listen(this.saal1, Mojo.Event.tap, this.openSaal1);
	Mojo.Event.listen(this.saal2, Mojo.Event.tap, this.openSaal2);
	Mojo.Event.listen(this.saal3, Mojo.Event.tap, this.openSaal3);
	
}

DayAssistant.prototype.activate = function(event) {
	dateArr = [];
	var today = this.date.getDate()+this.date.getMonth()+this.date.getFullYear();
	dateArr[0] = '27122010';
	dateArr[1] = '28122010';
	dateArr[2] = '29122010';
	dateArr[3] = '30122010';
	
	if(dateArr.join().indexOf(today)>=0) {
		if(dateArr[Number(this.day)] == today){
			this.chooseSaal();
		}
	}  
}


DayAssistant.prototype.deactivate = function(event) {	
	Mojo.Event.stopListening(this.saal1, Mojo.Event.tap, this.openSaal1);
	Mojo.Event.stopListening(this.saal2, Mojo.Event.tap, this.openSaal2);
	Mojo.Event.stopListening(this.saal3, Mojo.Event.tap, this.openSaal3);	
}

DayAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}


DayAssistant.prototype.handleTap= function(element, event) {
	switch(element.id){
		case 'saal1':
			var room = 0;
			this.title.update('Saal 1');
		break;
		case 'saal2':
			var room = 1;
			this.title.update('Saal 2');			
		break;
		case 'saal3':
			var room = 2;
			this.title.update('Saal 3');			
		break;
	}
	this.menuModel = {
        items: this.text[this.day][room]
	}
	this.controller.setWidgetModel("TimeWidget", this.menuModel);	
}

DayAssistant.prototype.chooseSaal = function() {
	thisHour = this.date.getHours();	
	var countroom;
	for (countroom = 2; countroom > -1; countroom--) {
		for (i = 0; i < this.text[this.day][countroom].length; i++) { //dayends
			if (this.text[this.day][countroom][i].hourid == thisHour) {
				this.chooseRoom = countroom;
				this.timeID = this.text[this.day][countroom][i].hourid;
			}
		}
	}	
	this.setTitle(this.chooseRoom);
	this.revealItem(this.timeID);			
}
DayAssistant.prototype.setTitle = function(room){
	switch(room){
		case 0:	
			this.title.update('Saal 1');
		break;
		case 1:
			this.title.update('Saal 2');			
		break;
		case 2:
			this.title.update('Saal 3');			
		break;
	}
}	
DayAssistant.prototype.revealItem = function(timeId) {	
	this.controller.setWidgetModel("TimeWidget", this.menuModel);
	this.timeList = this.controller.get('TimeWidget');
	this.timeList.mojo.revealItem(timeId, false);
}
