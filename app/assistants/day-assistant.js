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


/*
 * 
 * @todo: tap events (listeners), set css styles @ orient. change 
 * 
 * 
 */


function DayAssistant(response) {

    this.day = response.day;
    this.date = new Date();  
    this.chooseRoom = response.room;
	
	this.text = Fahrplan.data;   
}

DayAssistant.prototype.setup = function() {
  
    this.controller.setupWidget(Mojo.Menu.appMenu, appMenuAttributes, appMenuModel); 

    this.controller.setupWidget("scrollerId", {
                            mode: 'horizontal-snap'
                            }, this.model = {
                            snapElements: { x: $$('.scrollerItem') },
                            snapIndex: 0
                            });
    var widget;
	for(var i=0;i<3;i++){
		this.menuModel = {
            items: this.text[this.day][i]
        };
		widget = 'TimeWidget'+i;
	    this.controller.setupWidget(widget, {
	            itemTemplate: "day/day-row-template",
	            listTemplate: "day/day-list-template",
	            swipeToDelete: false, 
	            renderLimit: 50,
	            reorderable: false
	        },this.menuModel);
	}	

/*
	if (this.controller.stageController.setWindowOrientation) {
        this.controller.stageController.setWindowOrientation("free");
    }*/
    this.controller.listen(this.controller.document, 'orientationchange', this.handleOrientation.bindAsEventListener(this));  
	OrientationHelper = {};
    OrientationHelper.last = null;
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
    if (!OrientationHelper.back) {
		this.getStartupOrientation();
	}
	OrientationHelper.back = false;
    this.timewidget0 = this.controller.get("TimeWidget0");
	this.timewidget1 = this.controller.get("TimeWidget1");
	this.timewidget2 = this.controller.get("TimeWidget2");
	
    this.showDetails();  
};


DayAssistant.prototype.deactivate = function(event) {	

    Mojo.Event.stopListening(this.timewidget0, Mojo.Event.listTap, this.openDetailWithIdBind0);
	Mojo.Event.stopListening(this.timewidget1, Mojo.Event.listTap, this.openDetailWithIdBind1);
	Mojo.Event.stopListening(this.timewidget2, Mojo.Event.listTap, this.openDetailWithIdBind2);
	
};


DayAssistant.prototype.cleanup = function(event) {
    
};

DayAssistant.prototype.getStartupOrientation = function () {
        
    var orient = this.controller.stageController.getWindowOrientation();
     Mojo.Log.error(orient);    
	switch(orient){
        case "up":
        case "down":
            
            this.setPortrait();
        break;
        //landscape
        case "left":
        case "right":
            
            this.setLandscape();   
        break;   
    }
};


DayAssistant.prototype.handleOrientation = function (event) {
   
    switch(event.position){
        case 2:
        case 3:
            this.setPortrait();
        break;
        //landscape
        case 4:
        case 5:
            this.setLandscape();   
        break;   
    }
};
DayAssistant.prototype.setLandscape = function(){
    if (OrientationHelper.last != 'landscape') {
		$('scrollerItem:1').removeClassName('portrait');
        $('scrollerItem:2').removeClassName('portrait');
        $('scrollerItem:3').removeClassName('portrait');
		
		$('scrollerItem:1').addClassName('landscape');
        $('scrollerItem:2').addClassName('landscape');
        $('scrollerItem:3').addClassName('landscape');
		
		
		$('container').removeClassName('scrollerContainerPortait');
		//make bubbles longer

		for (var room = 0; room < 3; room++) {
			for (var i = 0; i < this.text[this.day][room].length; i++) {
				this.text[this.day][room][i].duration = Number(this.text[this.day][room][i].duration) * 2;
			}
		}
		
		
		for (var i = 0; i < 3; i++) {
			this.menuModel = {
				items: this.text[this.day][i]
			};
			widget = 'TimeWidget' + i;
			this.controller.setWidgetModel(widget, this.menuModel);
			this.controller.modelChanged(this.menuModel);
			
		}
		OrientationHelper.last = 'landscape';
	}	
};  
DayAssistant.prototype.setPortrait = function(){
    

	if(OrientationHelper.last != 'portrait'){
        $('scrollerItem:1').addClassName('portrait');
		$('scrollerItem:2').addClassName('portrait');
		$('scrollerItem:3').addClassName('portrait');
		
		$('scrollerItem:1').removeClassName('landscape');
        $('scrollerItem:2').removeClassName('landscape');
        $('scrollerItem:3').removeClassName('landscape');
		
		$('container').addClassName('scrollerContainerPortait');
		
        for (var room = 0; room < 3; room++) {
            for (var i = 0; i < this.text[this.day][room].length; i++) {
                this.text[this.day][room][i].duration = Number(this.text[this.day][room][i].duration) / 2;
            }
        }
        
        for (var i = 0; i < 3; i++) {
            this.menuModel = {
                items: this.text[this.day][i]
            };
            widget = 'TimeWidget' + i;
            this.controller.setWidgetModel(widget, this.menuModel);
            this.controller.modelChanged(this.menuModel);
            
        }

    }
    OrientationHelper.last = 'portrait';  
 
};  
/*
DayAssistant.prototype.handleTap= function(element, event) {
    switch(element.id){
        case 'saal1':
            this.chooseRoom = 0;
            this.title.update('Saal 1');
        break;
        case 'saal2':
            this.chooseRoom = 1;
            this.title.update('Saal 2');			
        break;
        case 'saal3':
            this.chooseRoom = 2;
            this.title.update('Saal 3');			
        break;
    }
    this.menuModel = {
        items: this.text[this.day][this.chooseRoom]
    }
    this.controller.setWidgetModel(this.timewidget, this.menuModel);
    this.controller.modelChanged(this.menuModel);
    this.showDetails(this.chooseRoom);
};
*/

DayAssistant.prototype.chooseSaal = function() {

    var thisHour = this.date.getHours();   
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
        this.controller.setWidgetModel(this.timewidget, this.menuModel);	
        this.revealItem(this.timeID);
    }	
			
};

/*
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
*/
//!!!!!!!!!!!!!!!!!!!!
DayAssistant.prototype.revealItem = function(timeID) {	

//    this.controller.setWidgetModel(this.timewidget, this.menuModel);
    this.timewidget.mojo.revealItem(timeID, false);
};


DayAssistant.prototype.showDetails = function(){
    
	this.room0 = 0;
	this.room1 = 1;
	this.room2 = 2;
	
    this.openDetailWithIdBind0 = this.openDetailWithId.bindAsEventListener(this, this.room0); //PRE-CACHE//
    this.openDetailWithIdBind1 = this.openDetailWithId.bindAsEventListener(this, this.room1); //PRE-CACHE//
    this.openDetailWithIdBind2 = this.openDetailWithId.bindAsEventListener(this, this.room2); //PRE-CACHE//
    
	this.controller.listen(this.timewidget0, Mojo.Event.listTap,this.openDetailWithIdBind0);
	this.controller.listen(this.timewidget1, Mojo.Event.listTap,this.openDetailWithIdBind1);
	this.controller.listen(this.timewidget2, Mojo.Event.listTap,this.openDetailWithIdBind2);	

};


DayAssistant.prototype.openDetailWithId = function(event, room){
    // emptyTimes[this.day][room][countEmpty].id = '0000';
    
	if (this.text[this.day][room][event.index].color != 'transparent') {

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
		switch(this.chooseRoom){
			case 0:
			
			break;
			
			case 1:
			
			break;
			
			case 2:
			
			break;
	
        }

        this.revealItem(id);    
};