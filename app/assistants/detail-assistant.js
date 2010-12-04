function DetailAssistant(response) {
    
    this.day = response.day;
    this.room = response.room;
    this.detailid = response.detailid;
        
    this.text = Fahrplan.data;
    this.content = [];
    this.content[0] = this.text[this.day][this.room][this.detailid];

}

DetailAssistant.prototype.setup = function() {
 /*
    this.startend = this.controller.get('startend');
    this.headline = this.controller.get('headline');
    this.subtitle = this.controller.get('subtitle');
    this.summary = this.controller.get('summary');
   */ 
   
/*    
    this.headline.update(this.content.title);
    this.startend.update(today+' - '+this.content.humanstartend);
    this.subtitle.update(this.content.subtitle);
    this.summary.update(this.content.summary);
 */   
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
    

};

DetailAssistant.prototype.cleanup = function(event) {
};
