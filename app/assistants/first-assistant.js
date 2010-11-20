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

FirstAssistant.prototype.setup = function() {

	this.controller.setupWidget(Mojo.Menu.appMenu,
	    this.attributes = {
	        omitDefaultItems: true
	    },
	    this.model = {
	        visible: true,
	        items: [ 
	            Mojo.Menu.editItem,
				{ label: "Help", command: "do-helpAddSub"},
				{ label: "About", command: 'do-About' }
	        ]
	    }
	);
   
    this.controller.setupWidget("MenuWidget", {
            itemTemplate: "first/first-row-template",
            listTemplate: "first/first-list-template",
            swipeToDelete: false, 
            renderLimit: 23,
            reorderable: false
        },    
        this.menuModel = {
            items: Congress.menu
        }
    );
   
    this.openMenuItem = this.openMenuItem.bindAsEventListener(this); //PRE-CACHE//

    
    var time =  Mojo.Format.formatDate(new Date(), {
		time: "medium",
        date: "medium",
		countryCode: "DE"
    });
    this.controller.get('time').update(time);
}

FirstAssistant.prototype.activate = function(event) {
	this.controller.listen("MenuWidget", Mojo.Event.listTap,this.openMenuItem);
}


FirstAssistant.prototype.deactivate = function(event) {
	this.controller.stopListening("MenuWidget", Mojo.Event.listTap,this.openMenuItem);

}

FirstAssistant.prototype.cleanup = function(event) {
   
   
}

FirstAssistant.prototype.openMenuItem = function(event) {
    
    Mojo.Controller.stageController.pushScene(this.menuModel.items[event.index].scene);

};

