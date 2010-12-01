function DetailAssistant(response) {
	
	this.day = response.day;
    this.room = response.room;
    this.detailid = response.detailid.id;
    
    this.text = Fahrplan.data;
    
    var i;
    for(i=0; i<this.text[this.day][this.room].length; i++){
        if(this.text[this.day][this.room][i].id){
            this.content = this.text[this.day][this.room][i];
            break;
        }
    }

}

DetailAssistant.prototype.setup = function() {
	/*
    this.cmdMenuModel = {
	    visible: true,
	    items: [
	        {items:[{label: $L('Add to Favorites'), icon:'new', command:'cmd-add'}]},
	    ]
	}; // save delete  
	*/
   
    this.startend = this.controller.get('startend');
    this.headline = this.controller.get('headline');
    this.subtitle = this.controller.get('subtitle');
    this.summary = this.controller.get('summary');
    
    dateArr = [];
	dateArr[0] = '27.12.2010';
	dateArr[1] = '28.12.2010';
	dateArr[2] = '29.12.2010';
	dateArr[3] = '30.12.2010';
    
    var today = dateArr[this.day]; 
    
    this.headline.update(this.content.title);
    this.startend.update(today+' - '+this.content.humanstartend);
    this.subtitle.update(this.content.subtitle);
//@todo:
//    abstract
//    language
//    color?
//    persons
//    track
   
};

DetailAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

DetailAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

DetailAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
