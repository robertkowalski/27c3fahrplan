function DetailAssistant(response) {
    
    this.day = response.day;
    this.room = response.room;
    this.detailid = response.detailid;
        
    this.text = Fahrplan.data;
    this.content = [];
    this.content[0] = this.text[this.day][this.room][this.detailid];

}


DetailAssistant.prototype.setup = function() {
   
    Mojo.Controller.stageController.delegateToSceneAssistant("update", this.room, this.detailid);

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
        
        
    this.buttonModel = {
         "label" : "Add to Favorites",
         "buttonClass" : "",
         "disabled" : false
     };
    //set up the button
    this.controller.setupWidget('UpdateButton', this.buttonAttributes, this.buttonModel); 
    this.favButton = this.controller.get('Favorites');
    this.addToFavs = this.addToFavorites.bindAsEventListener(this); 
    Mojo.Event.listen(this.favButton, Mojo.Event.tap, this.addToFavs);
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
};


DetailAssistant.prototype.deactivate = function(event) {
    
	Mojo.Event.stopListening(this.saal3, Mojo.Event.tap, this.openSaal3);	   
};

DetailAssistant.prototype.cleanup = function(event) {
};

DetailAssistant.prototype.addToFavorites = function(event){
    
};