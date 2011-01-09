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

Helper = {};
Helper.hide = function(){
    $('Scrim').hide();
    FirstAssistant.getStartupOrientation();
}

function FirstAssistant() {

}

FirstAssistant.prototype.setup = function(){

	
	this.appMenuModel = {
	        visible: true,
	        items: [Mojo.Menu.editItem, 
	        {
	            label: $L("Help"),
	            command: "do-helpAddSub"
	        }, 
	        {
	            label: $L("About"),
	            command: 'do-About'
	        }       
	        
	        ]
	    };

    this.controller.setupWidget(Mojo.Menu.appMenu, appMenuAttributes, this.appMenuModel);
    
    //Scrim triggered at Startup //
    this.spinnerModel = { spinning: true };
    this.spinnerAttributes = { spinnerSize: 'large',
                               fps: 30
                                };
    this.controller.setupWidget("progressSpinner", 
                               this.spinnerAttributes,
                               this.spinnerModel);
                                    
    this.controller.setupWidget("MenuWidget", {
        itemTemplate: "first/first-row-template",
        listTemplate: "first/first-list-template",
        swipeToDelete: false,
        renderLimit: 23,
        reorderable: false
    }, this.menuModel = {
        items: Congress.menu
    });
    
    this.bookmarksId = this.controller.get('bookmarks');
	this.showBookmarks = this.openFavorites.bindAsEventListener(this); //PRE-CACHE//
    
    this.openMenuItem = this.openMenuItem.bindAsEventListener(this); //PRE-CACHE//
    this.menuWidget = this.controller.get('MenuWidget');
   
    if (this.controller.stageController.setWindowOrientation) {
        this.controller.stageController.setWindowOrientation("free");
    }
	
	this.controller.serviceRequest('palm://com.palm.connectionmanager', {
	    method: 'getstatus', 
	    parameters:  {subscribe: true}, 
		onSuccess: this.handleResponse.bind(this)
    });
    
    this.orientationBinder = this.handleOrientation.bindAsEventListener(this);
	this.controller.listen(this.controller.document, 'orientationchange', this.orientationBinder);  
};



FirstAssistant.prototype.activate = function(event) {
    this.controller.listen(this.menuWidget, Mojo.Event.listTap, this.openMenuItem);
	this.controller.listen(this.bookmarksId, Mojo.Event.tap, this.showBookmarks);
    
};


FirstAssistant.prototype.deactivate = function(event) {
    this.controller.stopListening(this.menuWidget, Mojo.Event.listTap, this.openMenuItem);
    this.controller.stopListening(this.bookmarksId, Mojo.Event.tap, this.showBookmarks);
    this.controller.stopListening(this.controller.document, 'orientationchange',  this.orientationBinder);
};

FirstAssistant.prototype.cleanup = function(event) {
   
   
};
FirstAssistant.prototype.handleResponse = function (response) {

	if(response.wifi.state == 'disconnected' && response.wan.state == 'disconnected'){
        Mojo.Controller.errorDialog("You need a WAN or WLAN connection");

	}
	
}

FirstAssistant.prototype.openMenuItem = function(event) {
    var orient = this.controller.stageController.getWindowOrientation();
	
    Mojo.Controller.stageController.pushScene(
	   {name:this.menuModel.items[event.index].scene},
	   {
	   	   day: this.menuModel.items[event.index].day, 
	       room: 0,
		   orientation: orient
	   });
};

FirstAssistant.prototype.openFavorites = function(event) {
    
    Mojo.Controller.stageController.pushScene({
        name: "favorites"
    });
};

// START orientation handling //
FirstAssistant.prototype.getStartupOrientation = function () {
        
    var orient = this.controller.stageController.getWindowOrientation();

	switch(orient){
        case "up":
        case "down":
			this.setPortrait(); // change bubble size
        break;
        //landscape
        case "left":
        case "right":
			this.setLandscape();
        break;   
    }
};

FirstAssistant.prototype.handleOrientation = function (event) {

	   
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

FirstAssistant.prototype.setLandscape = function(){
    
	if (OrientationHelper.last != 'landscape') {
    
        //make bubbles longer
    for (this.day = 0; this.day < Fahrplan.data.length; this.day++) {
            for (var room = 0; room < 3; room++) {
                for (var i = 0; i < Fahrplan.data[this.day][room].length; i++) {
                    Fahrplan.data[this.day][room][i].duration = Number(Fahrplan.data[this.day][room][i].duration) * 2;
                }
            }
        }
    }
	OrientationHelper.last = 'landscape'; 

};  
FirstAssistant.prototype.setPortrait = function(){
	
	if(OrientationHelper.last != 'portrait'){
        for (this.day = 0; this.day < Fahrplan.data.length; this.day++) {
            for (var room = 0; room < 3; room++) {
                for (var i = 0; i < Fahrplan.data[this.day][room].length; i++) {
                    Fahrplan.data[this.day][room][i].duration = Number(Fahrplan.data[this.day][room][i].duration) / 2;
                }
            }
        }    
    }
    OrientationHelper.last = 'portrait';  
    
};  
// END orientation handling //

    