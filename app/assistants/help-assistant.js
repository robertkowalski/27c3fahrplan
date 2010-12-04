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

//without Help Entry //
    this.controller.setupWidget(Mojo.Menu.appMenu,
        this.attributes = {
            omitDefaultItems: true
        },
        this.model = {
            visible: true,
            items: [ 
                
                Mojo.Menu.editItem, //has to be first
                { label: "Preferences", command: 'do-Prefs' },
                { label: "About", command: 'do-About' }
            ]
        }
    );
    this.showComposeEmail = this.showComposeEmail.bindAsEventListener(this); //PRE-CACHE//
    this.whereCongress = this.whereCongress.bindAsEventListener(this); //PRE-CACHE//
    Mojo.Event.listen(this.controller.get('email'), Mojo.Event.tap, this.showComposeEmail);
    Mojo.Event.listen(this.controller.get('where'), Mojo.Event.tap, this.whereCongress);
}

HelpAssistant.prototype.activate = function(event) {

}


HelpAssistant.prototype.deactivate = function(event) {

    Mojo.Event.stopListening(this.controller.get('email'), Mojo.Event.listTap, this.showComposeEmail.bind(this));    
    Mojo.Event.stopListening(this.controller.get('where'), Mojo.Event.listTap, this.whereCongress.bind(this));    

}

HelpAssistant.prototype.cleanup = function(event) {

}

HelpAssistant.prototype.showComposeEmail = function(bind){
        this.controller.serviceRequest('palm://com.palm.applicationManager', {
            method: 'open',
            parameters: {
                id: 'com.palm.app.email',
                params: {
                    summary: "Congress-App Support Ticket",
                    text: "Hi Robert \n",
                    recipients: [{
                        value : "palm.webos.apps@googlemail.com",
                        contactDisplay : 'Congress-App Supportticket'
                    }]															
                }				
            }
        });
}

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
