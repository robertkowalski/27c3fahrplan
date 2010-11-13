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

}

FirstAssistant.prototype.activate = function(event) {
    this.controller.modelChanged(this.menuModel); 
}


FirstAssistant.prototype.deactivate = function(event) {
    //this.controller.stopListening("mainMenuWidget", Mojo.Event.listTap,this.openDay);
}

FirstAssistant.prototype.cleanup = function(event) {

}

FirstAssistant.prototype.openMenuItem = function(event) {
    
	if (this.menuModel.items[event.index].tapped === true)   {
	    //push scene
    } 
    
	
};

