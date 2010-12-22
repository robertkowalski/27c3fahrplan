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
};



FirstAssistant.prototype.activate = function(event) {
    this.controller.listen(this.menuWidget, Mojo.Event.listTap, this.openMenuItem);
	this.controller.listen(this.bookmarksId, Mojo.Event.tap, this.showBookmarks);

};


FirstAssistant.prototype.deactivate = function(event) {
    this.controller.stopListening(this.menuWidget, Mojo.Event.listTap, this.openMenuItem);
    this.controller.stopListening(this.bookmarksId, Mojo.Event.tap, this.showBookmarks);

};

FirstAssistant.prototype.cleanup = function(event) {
   
   
};

FirstAssistant.prototype.openMenuItem = function(event) {
    
    Mojo.Controller.stageController.pushScene({name:this.menuModel.items[event.index].scene},{day: this.menuModel.items[event.index].day, room: 0});
};

FirstAssistant.prototype.openFavorites = function(event) {
    
    Mojo.Controller.stageController.pushScene({
        name: "favorites"
    });
};
Helper = {};
Helper.hide = function(){
    $('Scrim').hide();
}    