// Create DB if not exists

var name = "ext:27c3";
var version = "0.1";  
var displayName = "New 27C3 Favorites DB"; 
var size = 200000;  
 
var db = openDatabase(name, version, displayName, size);
 
if (!db) {
  Mojo.Log.error("Could not open database");
} else {
    var sql = "CREATE TABLE IF NOT EXISTS 'my_table' (id INTEGER PRIMARY KEY, day INTEGER, room INTEGER, eventindex INTEGER, eventid TEXT)";  
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
        var sql = "SELECT * FROM 'my_table'";
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
    writeFav: function(day, room, eventindex, eventid) {
        var sql = "INSERT INTO 'my_table' (day, room, eventindex, eventid) VALUES (?, ?, ?, ?)";
        this.db.transaction( function (transaction) {
            transaction.executeSql(sql,  [day, room, eventindex, eventid], 
                function(transaction, results) {    // success handler
                    Mojo.Log.info("Successfully inserted record"); 
                },
                function(transaction, error) {      // error handler
                    Mojo.Log.error("Could not insert record: " + error.message);
                }
          );
        });  
    }
});

  
var DBAss = new myTable(db);

//test.writeFav(0, 2, 1337);



