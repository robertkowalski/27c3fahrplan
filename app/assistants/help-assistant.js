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


function HelpAssistant() {

}

HelpAssistant.prototype.setup = function() {
    
    //don't use StageController appMenuModel
    
    this.appMenuModel = {
        visible: true,
        items: [Mojo.Menu.editItem, 
        {
            label: $L("Bookmarks"),
            command: 'do-Favs'
        },
		{
            label: $L("About"),
            command: 'do-About'
        }]
    };
    
    
    this.controller.setupWidget(Mojo.Menu.appMenu, appMenuAttributes, this.appMenuModel);
    
    this.showComposeEmail = this.showComposeEmail.bindAsEventListener(this); //PRE-CACHE//
    this.whereCongress = this.whereCongress.bindAsEventListener(this); //PRE-CACHE//
    
    this.emailId = this.controller.get('email');
    this.mapsId = this.controller.get('where');
    
    this.controller.listen(this.emailId, Mojo.Event.tap, this.showComposeEmail);
    this.controller.listen(this.mapsId, Mojo.Event.tap, this.whereCongress);
    
    this.orientationBinder = this.handleOrientation.bindAsEventListener(this);
    this.controller.listen(this.controller.document, 'orientationchange', this.orientationBinder);  
};

HelpAssistant.prototype.activate = function(event) {

};


HelpAssistant.prototype.deactivate = function(event) {
    this.controller.stopListening(this.emailId, Mojo.Event.listTap, this.showComposeEmail.bind(this));    
    this.controller.stopListening(this.mapsId, Mojo.Event.listTap, this.whereCongress.bind(this));  
};

HelpAssistant.prototype.cleanup = function(event) {
    this.controller.stopListening(this.controller.document, 'orientationchange',  this.orientationBinder);
};

HelpAssistant.prototype.showComposeEmail = function(bind){
        this.controller.serviceRequest('palm://com.palm.applicationManager', {
            method: 'open',
            parameters: {
                id: 'com.palm.app.email',
                params: {
                    summary: "Congress-App Support Ticket",
                    text: "Hi Robert, \n",
                    recipients: [{
                        value : "palm.webos.apps@googlemail.com",
                        contactDisplay : 'Congress-App Support'
                    }]															
                }				
            }
        });
};

HelpAssistant.prototype.whereCongress = function(bind){
    this.controller.serviceRequest('palm://com.palm.applicationManager', {
        method: 'launch',
        parameters: {
            id: "com.palm.app.maps",
            params: {
                "query": 'Alexanderstr. 11, 10178 Berlin, Germany'
            }
        }
    });
};


// START orientation handling //
HelpAssistant.prototype.handleOrientation = function (event) {

	   
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

HelpAssistant.prototype.setLandscape = function(){
    
	if (OrientationHelper.last != 'landscape') {
    
        //make bubbles longer
        for (this.day = 0; this.day < Fahrplan.data.length; this.day++) {
            for (var room = 0; room < 3; room++) {
                for (var i = 0; i < Fahrplan.data[this.day][room].length; i++) {
                    Fahrplan.data[this.day][room][i].duration = Number(Fahrplan.data[this.day][room][i].duration) * 2;
                }
            }
        }
        OrientationHelper.last = 'landscape'; 
    }
	

};  

HelpAssistant.prototype.setPortrait = function(){
	
	if(OrientationHelper.last != 'portrait'){
        for (this.day = 0; this.day < Fahrplan.data.length; this.day++) {
            for (var room = 0; room < 3; room++) {
                for (var i = 0; i < Fahrplan.data[this.day][room].length; i++) {
                    Fahrplan.data[this.day][room][i].duration = Number(Fahrplan.data[this.day][room][i].duration) / 2;
                }
            }
        }    
        OrientationHelper.last = 'portrait';  
    }
    
    
};  
// END orientation handling //
