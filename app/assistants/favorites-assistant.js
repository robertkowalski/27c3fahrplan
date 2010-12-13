function FavoritesAssistant() {
    this.text = Fahrplan.data;
}

FavoritesAssistant.prototype.setup = function() {

    this.testmodel = []; 
    this.testmodel[0] = [];
    this.testmodel[0]['title'] = 'No Favorites saved';
    this.menuModel = {
            items: this.testmodel
    };
    
    this.controller.setupWidget("FavWidget", {
            itemTemplate: "favorites/favorites-row-template",
            listTemplate: "favorites/favorites-list-template",
            swipeToDelete: false, 
            renderLimit: 50,
            reorderable: false
        },this.menuModel);  
    
    this.favwidget = this.controller.get("FavWidget");    
};


FavoritesAssistant.prototype.activate = function(event) {
    DBAss.readFavs(this.processResults.bind(this)); 
};

FavoritesAssistant.prototype.processResults = function(inResults){

        this.favmodel = [];
        if (inResults.length > 0) {
            for (i = 0; i < inResults.length; i++) {
                this.favmodel[i] =[];
                this.favmodel[i]['title'] = this.text[inResults[i].day][inResults[i].room][inResults[i].eventindex]['title'];
                this.favmodel[i]['day'] = inResults[i].day;
                this.favmodel[i]['room'] = inResults[i].room;
                this.favmodel[i]['eventindex'] = inResults[i].eventindex;
            }
        } else {
            this.favmodel[0] =[];
            this.favmodel[0]['title'] = 'No Bookmarks saved';
        }
        this.menuModel = {
            items: this.favmodel
        };
	  //  Mojo.Log.error('eventindex'+inResults[i].eventindex);
         
        this.controller.setWidgetModel(this.favwidget, this.menuModel);
        this.controller.modelChanged(this.menuModel);
        
        this.openDetailWithIdBind = this.handleTap.bindAsEventListener(this); //PRE-CACHE//
        this.controller.listen(this.favwidget, Mojo.Event.listTap,this.openDetailWithIdBind);

}

FavoritesAssistant.prototype.handleTap = function(event){
    
    var day = this.favmodel[event.index]['day'];
    var room = this.favmodel[event.index]['room'];
    var index = this.favmodel[event.index]['eventindex'];
    Mojo.Log.error(event.index);
    Mojo.Controller.stageController.pushScene({
            name: 'detail'
        }, {
            day: day,
            room: room,
            detailid: index
        });

}    

FavoritesAssistant.prototype.deactivate = function(event) {
    Mojo.Event.stopListening(this.favwidget, Mojo.Event.listTap, this.openDetailWithIdBind);

};

FavoritesAssistant.prototype.cleanup = function(event) {

};
