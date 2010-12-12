function DetailAssistant(response) {
    
    this.day = response.day;
    this.room = response.room;
    this.detailid = response.detailid;
        
    this.text = Fahrplan.data;
    this.content = [];
    this.content[0] = this.text[this.day][this.room][this.detailid];

}


DetailAssistant.prototype.setup = function() {

    this.controller.setupWidget(Mojo.Menu.appMenu, this.attributes = {
        omitDefaultItems: true
    }, this.model = {
        visible: true,
        items: [Mojo.Menu.editItem, {
            label: "Help",
            command: "do-helpAddSub"
        }, {
            label: "About",
            command: 'do-About'
        }]
    });

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
        
    this.buttonAttributes = {
        
    };    
    this.buttonModel = {
         "label" : "Add to Favorites",
         "buttonClass" : "",
         "disabled" : false
     };
    //set up the button
    this.controller.setupWidget('FavoritesButton', this.buttonAttributes, this.buttonModel); 
    this.favButton = this.controller.get('FavoritesButton');
    this.addToFavs = this.addToFavorites.bindAsEventListener(this); 
    
    
    
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

DetailAssistant.prototype.addToFavorites = function(event){
    
    // day -> room -> eventindex -> eventid
    DBAss.writeFav(this.day, this.room, this.detailid, this.content[0].id);
    
    //...change button model  
    this.buttonModel.label ="Remove from Favorites";
    this.controller.modelChanged(this.buttonModel);
};

DetailAssistant.prototype.readFromFavorites = function(inResult){
    
    if(inResult.length > 0){
        Mojo.Event.stopListening(this.favButton, Mojo.Event.tap, this.addToFavs); 
        this.remFromFavs = this.deleteFromFavorites.bindAsEventListener(this); 
        Mojo.Event.listen(this.favButton, Mojo.Event.tap, this.remFromFavs);
        //...change button model
        

        this.buttonModel.label ="Remove from Favorites";
        this.controller.modelChanged(this.buttonModel);
        
        this.listener = 'remove';    
    
    } else { // just deleted and want to readd
        if (this.remFromFavs) {
            Mojo.Event.stopListening(this.favButton, Mojo.Event.tap, this.remFromFavs);
  
        }
        Mojo.Event.listen(this.favButton, Mojo.Event.tap, this.addToFavs);
        //...change button model
        
        this.buttonModel.label ="Add to Favorites";
        this.controller.modelChanged(this.buttonModel);
       
        this.listener = 'add';
        
    }
 
  
};

DetailAssistant.prototype.deleteFromFavorites = function(event){

    DBAss.removeFav(this.readFromFavorites, this.day, this.room, this.detailid);
    this.buttonModel.label ="Add to Favorites";
    this.controller.modelChanged(this.buttonModel);
}