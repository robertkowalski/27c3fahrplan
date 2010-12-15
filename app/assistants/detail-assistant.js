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

function DetailAssistant(response) {
    
    this.day = response.day;
    this.room = response.room;
    this.indexId = response.detailid;
        
    this.text = Fahrplan.data;
    this.content = [];
    this.content[0] = this.text[this.day][this.room][this.indexId];
    
    this.detailid = this.text[this.day][this.room][response.detailid].id;
    

}


DetailAssistant.prototype.setup = function() {

    this.controller.setupWidget(Mojo.Menu.appMenu, appMenuAttributes, appMenuModel);
    
    Mojo.Controller.stageController.delegateToSceneAssistant("update", this.room, this.indexId);

    this.detailModel = {
            items: this.content
    };
    
    this.controller.setupWidget("EventWidget", {
            itemTemplate: "detail/detail-row-template",
            listTemplate: "detail/detail-list-template",
            swipeToDelete: false, 
            renderLimit: 50,
            reorderable: false
        },this.detailModel);
        
    this.buttonAttributes = {
        
    };    
    this.buttonModel = {
         "label" : "Add Bookmark",
         "buttonClass" : "",
         "disabled" : false
     };
    //set up the button
    this.controller.setupWidget('FavoritesButton', this.buttonAttributes, this.buttonModel); 
    this.favButton = this.controller.get('FavoritesButton');
    
    this.addToFavs = this.addToFavorites.bindAsEventListener(this); 
    this.remFromFavs = this.deleteFromFavorites.bindAsEventListener(this); 
    
    
};


DetailAssistant.prototype.activate = function(event) {
    
    this.dayId = this.controller.get('day');
    
    dateArr = [];
    dateArr[0] = '27.12.2010';
    dateArr[1] = '28.12.2010';
    dateArr[2] = '29.12.2010';
    dateArr[3] = '30.12.2010';
    var today = dateArr[this.day]; 
    this.dayId.update(today); 
    
    DBAss.checkFavs(this.readFromFavorites.bind(this),this.day,this.room,this.detailid); 
};


DetailAssistant.prototype.deactivate = function(event) {
	if(this.listener == 'add') {
        Mojo.Event.stopListening(this.favButton, Mojo.Event.tap, this.addToFavs);
    } else {
        Mojo.Event.stopListening(this.favButton, Mojo.Event.tap, this.remFromFavs);

    }
    //Mojo.Event.stopListening(this.favButton, Mojo.Event.tap, this.addToFavs);	   
};

DetailAssistant.prototype.cleanup = function(event) {
};



DetailAssistant.prototype.readFromFavorites = function(inResult){
    
    if(inResult.length > 0){
        this.controller.stopListening(this.favButton, Mojo.Event.tap, this.addToFavs); 
        
        this.controller.listen(this.favButton, Mojo.Event.tap, this.remFromFavs);
        //...change button model
        

        this.buttonModel.label ="Remove Bookmark";
        this.controller.modelChanged(this.buttonModel);
        
        this.listener = 'remove';    
    
    } else {
        if (this.remFromFavs) {
            this.controller.stopListening(this.favButton, Mojo.Event.tap, this.remFromFavs);
  
        }
        this.controller.listen(this.favButton, Mojo.Event.tap, this.addToFavs);
        //...change button model
        
        this.buttonModel.label ="Add Bookmark";
        this.controller.modelChanged(this.buttonModel);
       
        this.listener = 'add';
        
    }
 
  
};

DetailAssistant.prototype.addToFavorites = function(event){
    
    // day -> room -> eventindex -> eventid

    DBAss.writeFav(this.day, this.room, this.detailid);
    
    //...change button model  
    this.buttonModel.label ="Remove Bookmark";
    this.controller.modelChanged(this.buttonModel);
    this.controller.stopListening(this.favButton, Mojo.Event.tap, this.addToFavs); 
    this.controller.listen(this.favButton, Mojo.Event.tap, this.remFromFavs);
    this.listener = 'remove';  
    
};

DetailAssistant.prototype.deleteFromFavorites = function(event){

    DBAss.removeFav(this.day, this.room, this.detailid);
    this.buttonModel.label ="Add to Favorites";
    this.controller.modelChanged(this.buttonModel);
    this.controller.stopListening(this.favButton, Mojo.Event.tap, this.remFromFavs);
    this.controller.listen(this.favButton, Mojo.Event.tap, this.addToFavs);
    this.listener = 'add';
}

