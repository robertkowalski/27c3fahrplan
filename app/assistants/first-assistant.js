function FirstAssistant() {

}

FirstAssistant.prototype.setup = function() {

   
    this.controller.setupWidget("MenuWidget", 
        {
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
    this.controller.listen("MenuWidget", Mojo.Event.listTap,this.openMenuItem);
    
    var time =  Mojo.Format.formatDate(new Date(), {
		time: "medium",
        date: "medium",
		countryCode: "DE"
    });
    this.controller.get('time').update(time);
}

FirstAssistant.prototype.activate = function(event) {
    this.controller.modelChanged(this.menuModel); 
}


FirstAssistant.prototype.deactivate = function(event) {
    this.controller.stopListening("MenuWidget", Mojo.Event.listTap,this.openMenuItem);
}

FirstAssistant.prototype.cleanup = function(event) {

}

FirstAssistant.prototype.openMenuItem = function(event) {
    
    Mojo.Log.error(this.menuModel.items[event.index].scene);
    Mojo.Controller.stageController.pushScene(this.menuModel.items[event.index].scene);

};

