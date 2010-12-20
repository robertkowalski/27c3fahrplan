function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
    
    this.controller.pushScene("first");
    
    appMenuAttributes = {
        omitDefaultItems: true
    };
    appMenuModel = {
        visible: true,
        items: [Mojo.Menu.editItem, 
        {
            label: $L("Bookmarks"),
            command: 'do-Favs'
        },
        {
            label: $L("Help"),
            command: "do-helpAddSub"
        }, 
        {
            label: $L("About"),
            command: 'do-About'
        }  
		
		
		]
    };

    
};



StageAssistant.prototype.handleCommand = function(event) {
    
    var currentScene = this.controller.activeScene();
    if(event.type == Mojo.Event.command) {
        switch(event.command) {
            case 'do-About':
                currentScene.showAlertDialog({
                    onChoose: function(value) {},
                    title:  Mojo.Controller.appInfo.title + ' - v' + Mojo.Controller.appInfo.version,
                    message: '&copy; 2010, R. Kowalski & O. Machulla'+'<div><br>This App has no <br></br>super-pyramide-powers.</br></div>',
                    choices:[
                    {label: "OK", value:""}
                    ],
                    allowHTMLMessage: true
                });
            break;
            case 'do-helpAddSub':
                this.controller.pushScene("help");
            break; 
            case 'do-Favs':
                this.controller.pushScene("favorites");
            break; 
        }
    }
};