var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();

var bodyParser = require('body-parser');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/crs", {native_parser:true});
var url = 'mongodb://localhost:27017/crs';

function uniq(a) {
	var seen = {};
	return a.filter(function(item) {
		return seen.hasOwnProperty(item) ? false : (seen[item] = true);
	});
}

//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'html');

app.get('/', function(req, res) {
	res.render('index.html')
});
app.get('/result', function(req, res) {
	res.render('result.html');
});
app.get('/items', function(req, res) {
	res.render('item.html');
});
app.get('/about', function(req, res){
	res.render('about.html');
})

app.get('/search', function(req, res){
	var query = req.query.q;
	var regex = new RegExp(query, 'i')
	db.bind('reports');

	db.reports.aggregate([
	{ $match: { "parsed_metadata.title": regex}}, 
	{ $sort: { "parsed_metadata.date": -1 }},
	{ $limit: 500 }
	], function(err, results){
		if(err){
			console.log(err);
			return res.status(500).send("There is an error");
		}
		var unique = {};
		var distinct = [];
		
		//This displays only the most recent version of a Title
		results.forEach(function (x) {
		  if (!unique[x.parsed_metadata.ordercode]) {
		    distinct.push(x);
		    unique[x.parsed_metadata.ordercode] = true;
		  }
		});
		res.send(distinct);
	})

})

//logic for item page
app.get('/getitem', function(req, res){
	var query = req.query.q;
	db.bind('reports');

        db.reports.aggregate(
           [{$match: {"parsed_metadata.ordercode":req.query.q}},
            {$group: {'_id': "$parsed_metadata.date",
                      title : {$first : "$parsed_metadata.title"},
                      sha256 : {$first : "$sha256"},
                      ordercode : {$first : "$parsed_metadata.ordercode"}}} ],
        function(err, results) {
           if(err){
              console.log(err);
              return res.status(500).send("There is an error");
           }
           res.send(results);
        });

	/*db.reports.find(
	{ "parsed_metadata.ordercode": query}).toArray( 
	function(err, results){
		if(err){
			console.log(err);
			return res.status(500).send("There is an error");
		}
		res.send(results);
	});*/

})

///break off onto a nesssw resource get file renders layouts page formating from additional file
// Code fos report info page
app.get('/report', function(req, res) {
	db.bind('reports');
	db.reports.find({'parsed_metadata.ordercode': req.query.id}).toArray(function(err, items) {
	//title
	var title = items[0]['parsed_metadata']['title'];
	var rptid = items[0]['parsed_metadata']['ordercode'];
	var dates = [];
	var sourcevar = [];
	var urlvar = [];
	
	
	items.forEach(function(it){
//	    sourcevar += it['parsed_metadata']['source'] + "<br/>"
sourcevar.push(it['source']);
});
	var sourcevarTxt = "";
	uniq(sourcevar).forEach(function(d){
		sourcevarTxt += d + "<br/>"
	});
	
	items.forEach(function(it){
		urlvar.push(it['url']);
	});
	var urlvarTxt = "";
	uniq(urlvar).forEach(function(d){
		urlvarTxt += d + "<br/>"
	});
	
	
	

	items.forEach(function(it){
//	    dates += it['parsed_metadata']['date'] + "<br/>"
dates.push(it['parsed_metadata']['date']);
});
	var dateTxt = "";
	uniq(dates).forEach(function(d){
		dateTxt += d + "<br/>"
	});
	
	
	res.send("<h1>" + items[0]['parsed_metadata']['title'] + "</h1>" +
		"<h2>Order Code</h2>" + rptid +
		 //"<h2>Sources</h2>" + sourcevarTxt +
		 //"<h2>URL Source</h2>" + urlvarTxt +
		 "<h2>Dates</h2>" + dateTxt);

//	res.send(items);
});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('CRSReports App listening at http://%s:%s/crs-test', host, port);});


