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
        if (inResults) {
            for (i = 0; i < inResults.length; i++) {
                this.favmodel[i] =[];
                this.favmodel[i]['title'] = this.text[inResults[i].day][inResults[i].room][inResults[i].eventindex]['title'];
            }
        } else {
            this.favmodel[0]['title'] = 'No Favorites saved';
        }
        this.menuModel = {
            items: this.favmodel
        };
	 
        this.controller.setWidgetModel(this.favwidget, this.menuModel);
        this.controller.modelChanged(this.menuModel);
}

FavoritesAssistant.prototype.handleTap = function(event){

}    

FavoritesAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
       this scene is popped or another scene is pushed on top */
};

FavoritesAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
       a result of being popped off the scene stack */
};
