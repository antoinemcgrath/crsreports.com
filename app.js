var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('crslist.db');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

// Begin code for search!!
app.get('/search', function(req, res) {
    var query = req.query.q;
    var the_data_to_send = "";

    // WARNING THIS IS VULNERABLE TO SQL INJECTION
    db.all('SELECT title, time FROM importedcrs where title like "%' + query + '%" ', function(err, rows) {
	rows.forEach(function(row){
	    the_data_to_send = the_data_to_send + "<tr><td>" + row.title + '</td><td>' + row.time +"</td></tr>";
	});
	
	res.send("<h2>Search Results for query <small>" + query + "</small>:</h2><table border='1'>" + the_data_to_send + "</table>")
	
    });
});
// End code for search

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('CRSReports App listening at http://%s:%s/crs-test', host, port);});
