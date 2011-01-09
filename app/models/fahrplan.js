Fahrplan = {};

Fahrplan.process = function (response) {
    
    this.text = response.responseText.evalJSON(true);
/*
    Fahrplan.data = Object.toJSON(json);
    this.text = Fahrplan.data = Fahrplan.data.evalJSON(true);
*/   
    var emptyTimes = [];      
        
    var countEmpty = 0;
    var room, i;
    
    Fahrplan.daysCount = this.text.length -1;
    
    for(this.day = 0; this.day < this.text.length; this.day++){   
        emptyTimes[this.day] = []; 
        for (room = 0; room < this.text[this.day].length; room++) {
            emptyTimes[this.day][room] = [];	
            //Create times where no event is	
            for (i = 0; i < this.text[this.day][room].length - 1; i++) {
                //borders for bubbles
                this.text[this.day][room][i].color =  this.text[this.day][room][i].color + ';border:1px solid black;';
                this.text[this.day][room][i].feedback = 'immediate';
                //create empty times for template
                if (this.text[this.day][room][i].ending < this.text[this.day][room][i + 1].start) {
                    emptyTimes[this.day][room][countEmpty] = [];
                    emptyTimes[this.day][room][countEmpty].start = this.text[this.day][room][i].ending;
                    emptyTimes[this.day][room][countEmpty].ending = this.text[this.day][room][i + 1].start;
                    emptyTimes[this.day][room][countEmpty].persons = '';
                    emptyTimes[this.day][room][countEmpty].language = '';
                    emptyTimes[this.day][room][countEmpty].color = 'transparent';
                    emptyTimes[this.day][room][countEmpty].track = '';
                    emptyTimes[this.day][room][countEmpty].subtitle = '&nbsp;';
                    emptyTimes[this.day][room][countEmpty].title = '&nbsp;';
                    emptyTimes[this.day][room][countEmpty].duration = Number(emptyTimes[this.day][room][countEmpty].ending) - Number(emptyTimes[this.day][room][countEmpty].start);
                    emptyTimes[this.day][room][countEmpty].slots = emptyTimes[this.day][room][countEmpty].duration / 15;
                    emptyTimes[this.day][room][countEmpty].humanstartend = '';
                    emptyTimes[this.day][room][countEmpty].hourid = 'n';
                    emptyTimes[this.day][room][countEmpty].id = '0000';
                    emptyTimes[this.day][room][countEmpty].feedback = 'none';
                    countEmpty++;
                }
            }
            //draw border around last bubble
            this.text[this.day][room][this.text[this.day][room].length - 1].color =  this.text[this.day][room][this.text[this.day][room].length - 1].color + ';border:1px solid black;';
    
            countEmpty=0;
            this.text[this.day][room] = this.text[this.day][room].concat(emptyTimes[this.day][room]);
            
            this.text[this.day][room].sort(function(a, b){
                return a.start - b.start
            });
            // make bubbles bigger
            for(var i=0; i<this.text[this.day][room].length; i++){
                this.text[this.day][room][i].duration = Number(this.text[this.day][room][i].duration)*6.5;
               
            }
            
        } //End Line 82
    }	
    Fahrplan.data = this.text;
    Helper.hide(); //hide Scrim
    Fahrplan.data = Fahrplan.data.evalJSON(true);
    
};



var request = new Ajax.Request(Url.url, {
	sanitizeJSON: true,
	method: 'post',
	evalJSON: 'true',	
	requestHeaders: {Accept: 'application/json'},
//	onLoading: this.startSpinner.bind(this),
	onSuccess: Fahrplan.process.bind(this)	   					
});



  

