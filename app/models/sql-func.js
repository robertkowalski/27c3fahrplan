// Create DB if not exists

var name = "ext:27c3_v1.4";
var version = "0.1";  
var displayName = "New2 27C3 Favorites DB"; 
var size = 200000;  
 
var db = openDatabase(name, version, displayName, size);
 
if (!db) {
  Mojo.Log.error("Could not open database");
} else {
    var sql = "CREATE TABLE IF NOT EXISTS 'table' (id INTEGER PRIMARY KEY, day INTEGER, room INTEGER, eventid TEXT)";  
    db.transaction( function (transaction) {
        transaction.executeSql(sql,
                           [],
                           function(transaction, results) {    // success handler
                             Mojo.Log.info("Successfully created table"); 
                           },
                           function(transaction, error) {      // error handler
                             Mojo.Log.error("Could not create table: " + error.message);
                           }
        );
  }.bind(this));
}
 
myTable = Class.create({
    initialize: function(db) {
        this.db = db;
    },
    readFavs: function(callback) {
        var sql = "SELECT * FROM 'table'";
        this.db.transaction(function(transaction) {
            transaction.executeSql(sql, [],
                function(transaction, results) {  
                    var row;
                    var result = [];
                    for (var i = 0; i < results.rows.length; i++) {
                        result[i] = results.rows.item(i);
                    }                         
                    callback(result);
                }.bind(this),
                function(transaction, error) {
                    Mojo.Log.error("Could not read: " + error.message);
                }.bind(this)
            );
        });  
    },
    writeFav: function(day, room, eventid) {
        var sql = "INSERT INTO 'table' (day, room, eventid) VALUES (?, ?, ?)";
        this.db.transaction( function (transaction) {
            transaction.executeSql(sql,  [day, room, eventid], 
                function(transaction, results) {    // success handler
                    Mojo.Log.info("Successfully inserted record"); 
                }.bind(this),
                function(transaction, error) {      // error handler
                    Mojo.Log.error("Could not insert record: " + error.message);
                }.bind(this)
          );
        });  
    },
    checkFavs: function(callback, day, room, eventid) { 
        var sql = "SELECT * FROM 'table' WHERE day = "+day+" AND room ="+room+" AND eventid = "+eventid;
        this.db.transaction(function(transaction) {
            transaction.executeSql(sql, [],
                function(transaction, results) {  
                    var row;
                    var result = [];
                    for (var i = 0; i < results.rows.length; i++) {
                        result[i] = results.rows.item(i);
                    }                         
                    callback(result);
                }.bind(this),
                function(transaction, error) {
                    Mojo.Log.error("Could not read(checkfavs): " + error.message);
                }.bind(this)
            );
        }); 
    
    },
    removeFav: function(day, room, eventid){
        var sql = "DELETE FROM 'table' WHERE day = "+day+" AND room ="+room+" AND eventid = "+eventid;
        this.db.transaction(function(transaction) {
            transaction.executeSql(sql, [],
                function(transaction, results) {    // success handler
                    Mojo.Log.info("Successfully deleted record"); 
                }.bind(this),
                function(transaction, error) {
                    Mojo.Log.error("Could not remove: " + error.message);
                }.bind(this)
            );
        }); 
    }    
});

  
var DBAss = new myTable(db);
