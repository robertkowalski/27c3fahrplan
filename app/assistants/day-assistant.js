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
    this.chooseRoom = response.room;
    Mojo.Log.error(response.update);
    
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
};


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

    this.openSaal1 = this.handleTap.bind(this, this.saal1);
    this.openSaal2 = this.handleTap.bind(this, this.saal2);
    this.openSaal3 = this.handleTap.bind(this, this.saal3);
    this.controller.listen(this.saal1, Mojo.Event.tap, this.openSaal1);
    this.controller.listen(this.saal2, Mojo.Event.tap, this.openSaal2);
    this.controller.listen(this.saal3, Mojo.Event.tap, this.openSaal3);
    
    this.timewidget = this.controller.get("TimeWidget");
    this.showDetails(this.chooseRoom);  
};


DayAssistant.prototype.deactivate = function(event) {	
    Mojo.Event.stopListening(this.saal1, Mojo.Event.tap, this.openSaal1);
    Mojo.Event.stopListening(this.saal2, Mojo.Event.tap, this.openSaal2);
    Mojo.Event.stopListening(this.saal3, Mojo.Event.tap, this.openSaal3);	

    Mojo.Event.stopListening(this.timewidget, Mojo.Event.listTap, this.openDetailWithIdBind);
};


DayAssistant.prototype.cleanup = function(event) {

};


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
    this.controller.setWidgetModel(this.timewidget, this.menuModel);
    this.controller.modelChanged(this.menuModel);
    Mojo.Event.stopListening(this.timewidget, Mojo.Event.listTap, this.openDetailWithIdBind);
    this.showDetails(room);
};


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
        this.controller.setWidgetModel(this.controller.get("TimeWidget"), this.menuModel);	
        this.setTitle(this.chooseRoom);
        this.revealItem(this.timeID);
        this.showDetails(this.chooseRoom);
    }	
    return true;			
};


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
    
};	


DayAssistant.prototype.revealItem = function(timeID) {	

    this.controller.setWidgetModel(this.timewidget, this.menuModel);
    this.timewidget.mojo.revealItem(timeID, false);
};


DayAssistant.prototype.showDetails = function(room){

    this.room = room;
    
    this.openDetailWithIdBind = this.openDetailWithId.bindAsEventListener(this, this.room); //PRE-CACHE//
    this.controller.listen(this.timewidget, Mojo.Event.listTap,this.openDetailWithIdBind, false);
};


DayAssistant.prototype.openDetailWithId = function(event, room){
    // emptyTimes[this.day][room][countEmpty].id = '0000';
    if (this.text[this.day][this.chooseRoom][event.index].id != '0000') {
    
        Mojo.Controller.stageController.pushScene({
            name: 'detail'
        }, {
            day: this.day,
            room: room,
            detailid: event.index
        });
    
    }
};


DayAssistant.prototype.update = function(room, id){
    
        this.chooseRoom = room;
        this.menuModel = {
            items: this.text[this.day][this.chooseRoom]
        };
        this.controller.setWidgetModel(this.controller.get("TimeWidget"), this.menuModel);	
        this.revealItem(id);    
};