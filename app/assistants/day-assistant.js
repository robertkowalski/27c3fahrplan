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
    	 
    this.orientation = response.orientation;
    this.day = response.day;
    this.date = new Date();  
    this.chooseRoom = response.room;
	
	this.text = Fahrplan.data;
	
	$('title1').hide();
    $('title2').hide();
    $('title3').hide();   
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

    this.orientationBinder = this.handleOrientation.bindAsEventListener(this);
    this.controller.listen(this.controller.document, 'orientationchange', this.orientationBinder);  
    

	
};



DayAssistant.prototype.activate = function(event) {

	this.timewidget0 = this.controller.get("TimeWidget0");
    this.timewidget1 = this.controller.get("TimeWidget1");
    this.timewidget2 = this.controller.get("TimeWidget2");
   
    this.getStartupOrientation();
	
	//make bubble tapable	
    this.showDetails();  
	
/*
	//just jump to event if the day = current day of event
    dateArr = [];
    var today = this.date.getDate()+this.date.getMonth()+this.date.getFullYear();
Mojo.Log.error(today);
    today = '29122010';
    dateArr[0] = '27122010';
    dateArr[1] = '28122010';
    dateArr[2] = '29122010';
    dateArr[3] = '30122010';
    
    if(dateArr.join().indexOf(today)>=0) {
        if(dateArr[Number(this.day)] == today){
			var orient = this.controller.stageController.getWindowOrientation();
			if (orient == 'right' || orient == 'left') {
				this.chooseSaal();
			}
        }
    } 
*/
};


DayAssistant.prototype.deactivate = function(event) {	

    this.controller.stopListening(this.timewidget0, Mojo.Event.listTap, this.openDetailWithIdBind0);
	this.controller.stopListening(this.timewidget1, Mojo.Event.listTap, this.openDetailWithIdBind1);
	this.controller.stopListening(this.timewidget2, Mojo.Event.listTap, this.openDetailWithIdBind2);

    this.controller.stopListening(this.controller.document, 'orientationchange',  this.orientationBinder);  

};


DayAssistant.prototype.cleanup = function(event) {
    OrientationHelper.alreadyVisited = true;
};

DayAssistant.prototype.getStartupOrientation = function () {
        
    var orient = this.controller.stageController.getWindowOrientation();

	switch(orient){
        case "up":
        case "down":
			this.setPortrait(false); // change bubble size
        break;
        //landscape
        case "left":
        case "right":
			this.setLandscape(false);
        break;   
    }
};


DayAssistant.prototype.handleOrientation = function (event) {

	   
    switch(event.position){
        case 2:
        case 3:
		    $('title1').hide();
            $('title2').hide();
            $('title3').hide();
            this.setPortrait(false);
        break;
        //landscape
        case 4:
        case 5:
		    $('title1').hide();
            $('title2').hide();
            $('title3').hide();
            this.setLandscape(false);   
        break;   
    }
};
DayAssistant.prototype.setLandscape = function(first){
    
	
	$('scrollerItem:1').removeClassName('portrait');
    $('scrollerItem:2').removeClassName('portrait');
    $('scrollerItem:3').removeClassName('portrait');
	
	$('scrollerItem:1').addClassName('landscape');
    $('scrollerItem:2').addClassName('landscape');
    $('scrollerItem:3').addClassName('landscape');
	
	
	$('container').removeClassName('scrollerContainerPortait');
	if (OrientationHelper.last != 'landscape') {

		//make bubbles longer
	    if (!first) {
			for (var room = 0; room < 3; room++) {
				for (var i = 0; i < this.text[this.day][room].length; i++) {
					Fahrplan.data[this.day][room][i].duration = Number(this.text[this.day][room][i].duration) * 2;
				}
			}
			
			this.text = Fahrplan.data;
			this.newMenuModel = [];
			for (var i = 0; i < 3; i++) {
				this.newMenuModel[i] = {
					items: this.text[this.day][i]
				};
	
			}
			
			this.controller.setWidgetModel(this.timewidget0, this.newMenuModel[0]);
	        this.controller.setWidgetModel(this.timewidget1, this.newMenuModel[1]);
			this.controller.setWidgetModel(this.timewidget2, this.newMenuModel[2]);
	//			this.controller.modelChanged(this.menuModel);
		}	
		
	}
	OrientationHelper.last = 'landscape'; 
    $('title1').show();
    $('title2').show();
    $('title3').show();
};  
DayAssistant.prototype.setPortrait = function(first){
    

    $('scrollerItem:1').addClassName('portrait');
	$('scrollerItem:2').addClassName('portrait');
	$('scrollerItem:3').addClassName('portrait');
	
	$('scrollerItem:1').removeClassName('landscape');
    $('scrollerItem:2').removeClassName('landscape');
    $('scrollerItem:3').removeClassName('landscape');
	
	$('container').addClassName('scrollerContainerPortait');
	if(OrientationHelper.last != 'portrait'){
		if (!first) {
			for (var room = 0; room < 3; room++) {
				for (var i = 0; i < this.text[this.day][room].length; i++) {
					Fahrplan.data[this.day][room][i].duration = Number(this.text[this.day][room][i].duration) / 2;
				}
			}
            this.text = Fahrplan.data;
            this.newMenuModel = [];
            for (var i = 0; i < 3; i++) {
                this.newMenuModel[i] = {
                    items: this.text[this.day][i]
                };

            }
            
            this.controller.setWidgetModel(this.timewidget0, this.newMenuModel[0]);
            this.controller.setWidgetModel(this.timewidget1, this.newMenuModel[1]);
            this.controller.setWidgetModel(this.timewidget2, this.newMenuModel[2]);
		}
    
    }
    OrientationHelper.last = 'portrait';  
    $('title1').show();
    $('title2').show();
    $('title3').show(); 
};  


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

        this.revealItem(this.timeID,this.chooseRoom);
    }	
			
};


DayAssistant.prototype.revealItem = function(timeID, room) {	
//Mojo.Log.error(room+'  '+timeID);

		    this.controller.setWidgetModel(this.timewidget0, this.newMenuModel[0]);
	       	this.timewidget0.mojo.revealItem(timeID, false);

    
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
