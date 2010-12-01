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
             label : $L('Saal 1'),
             disabled: false
         }
     );
     this.controller.setupWidget("saal2",
         this.attributes = {
             },
         this.model = {
             label : $L('Saal 2'),
             disabled: false
			 
         }
     );
     this.controller.setupWidget("saal3",
         this.attributes = {
             },
         this.model = {
             label : $L('Saal 3'),
             disabled: false
         }
     );

	this.cmdMenuModel = {
 		visible: true,
 		items: [{}, this.reloadModel]
     };
	
    this.text = Fahrplan.data;


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
	//just jump to event if the day = current day of event
	dateArr = [];
	var today = this.date.getDate()+this.date.getMonth()+this.date.getFullYear();
//    today = '29122010';
	dateArr[0] = '27122010';
	dateArr[1] = '28122010';
	dateArr[2] = '29122010';
	dateArr[3] = '30122010';
	
	if(dateArr.join().indexOf(today)>=0) {
		if(dateArr[Number(this.day)] == today){
			this.chooseSaal();
		}
	}
    this.showDetails(this.chooseRoom);  
/*    
    //make bubbles tapable
    var room = 0;
    var detailid, openDetail;
//    for (room = 0; room < 3; room++) {
        for (i = 0; i < this.text[this.day][0].length; i++) {
            detailid = this.controller.get(this.text[this.day][0][i].id); // can just get events of current room/template
            openDetail = this.openDetailWithId.bind(this, this.day, room, detailid); //PRE-CACHE//
            Mojo.Event.listen(detailid, Mojo.Event.tap, openDetail);
        }
//   }*/
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
	var thisHour = this.date.getHours();   
//    Mojo.Log.error(thisHour);	
	var countroom;
    
	for (countroom = 2; countroom > -1; countroom--) {
		for (i = 0; i < this.text[this.day][countroom].length; i++) {
			if (this.text[this.day][countroom][i].hourid == thisHour) {
				this.chooseRoom = countroom;
				this.timeID = i;
                break;
			}
		}
        if (this.timeID) {
            break;
        }    
	} //max 2hrs for next events if currently no event
	
	if(!this.timeID){
		thisHour = thisHour+1;
		for (countroom = 2; countroom > -1; countroom--) {
			for (i = 0; i < this.text[this.day][countroom].length; i++) { 
				if (this.text[this.day][countroom][i].hourid == thisHour) {
					this.chooseRoom = countroom;
					this.timeID = this.text[this.day][countroom][i].hourid;
				}
			}
		}
	}	
	if(!this.timeID){
		thisHour = thisHour+2;
		for (countroom = 2; countroom > -1; countroom--) {
			for (i = 0; i < this.text[this.day][countroom].length; i++) { 
				if (this.text[this.day][countroom][i].hourid == thisHour) {
					this.chooseRoom = countroom;
					this.timeID = this.text[this.day][countroom][i].hourid;
				}
			}
		}
	}	
//   Mojo.Log.error('timeid: '+this.timeID);
	if (this.timeID) {
        this.menuModel = {
            items: this.text[this.day][this.chooseRoom]
        };
        this.controller.setWidgetModel("TimeWidget", this.menuModel);	
		this.setTitle(this.chooseRoom);
		this.revealItem(this.timeID);
        this.showDetails(this.chooseRoom);
	}	
    return true;			
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
DayAssistant.prototype.revealItem = function(timeID) {	
	this.controller.setWidgetModel("TimeWidget", this.menuModel);
	this.timeList = this.controller.get('TimeWidget');
    Mojo.Log.error('revealItem:'+timeID);
	this.timeList.mojo.revealItem(timeID, false);
}

DayAssistant.prototype.showDetails = function(room){
    //make bubbles tapable
//    var room = 0;
    this.room = room;
    
    var detailid, openDetail;
   
    for (i = 0; i < this.text[this.day][this.room].length; i++) {
        detailid = this.controller.get(this.text[this.day][this.room][i].id); // can just get events of current room/template
        openDetail = this.openDetailWithId.bind(this, this.day, this.room, detailid); //PRE-CACHE//
        Mojo.Event.listen(detailid, Mojo.Event.tap, openDetail);
    }
}

DayAssistant.prototype.openDetailWithId = function(day, room, event) {

        Mojo.Controller.stageController.pushScene(  { name:'detail' },
                                                    {   day: day,
                                                        room: room,
                                                        detailid: event
                                                     });

}