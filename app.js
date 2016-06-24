var express = require('express');
var app = express();

var config = require('./config.json')
var fs = require('fs');
var https = require('https');
var http = require('http');
var helmet = require('helmet');
var constants = require('constants');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ReadPreference = require('mongodb');
//var mongo = require('mongoskin');///
//var db = mongo.db("mongodb://localhost:27017/crs", {native_parser:true});///
//var url = 'mongodb://localhost:27017/crs';///

//var db = null;

//console.log(config.mongo);

var path = require('path');

function uniq(a) {
        var seen = {};
        return a.filter(function(item) {
                return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
}

app.use(helmet());
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
app.get('/item', function(req, res) {
        res.render('result.html');
});
app.get('/about', function(req, res){
        res.render('about.html');
})
app.get('/download', function(req,res){
    var hash = req.query.hash;
    db.collection('reports').findOne({sha256: hash, parsed_metadata : {$exists: true}}, function(err, result){
        if(err || !result) {
             //XXX: Error

            console.log("error");
            res.redirect(301, '/');
            return;
        }
        var oc = result.parsed_metadata.ordercode;
        var date = result.parsed_metadata.date;
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        if (oc && date) {
            var filename = oc + "_" + date.getUTCDate() + "-" + months[date.getUTCMonth()] + "-" + date.getUTCFullYear() + ".\
pdf";

                var stream = fs.createReadStream('public/links_reports/' + path.normalize(hash));
                stream.on('error',function(err) {
                   console.log("error: a report in the database WAS NOT FOUND ON DISK");
                   res.redirect(302, '/');
                });
            res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
                res.setHeader('Content-type', 'application/pdf');
          //  res.end('public/links_reports/' + path.normalize(hash), filename);
                stream.pipe(res);
          //  res.download('public/links_reports/' + path.normalize(hash), filename);
        } else {
          //  XXX: Error
        }
    });


});
app.get('/search', function(req, res){  var query = req.query.q;
//      var regex = new RegExp(query, 'i')
//      db.bind('reports');
        db.collection("reports").aggregate([
        { $match: { $text : { $search: query}} },
//      { $limit: 100 },
        { $sort: {"parsed_metadata.date": -1 }},
        { $group: {'_id': '$parsed_metadata.ordercode',
                   title : {$first : "$parsed_metadata.title"},
                   sha256 : {$first : "$sha256"},
                   date : {$first : "$parsed_metadata.date"},
                   score: {$first : {$meta: "textScore"}}}},
//         first score, date, then title
        { $sort: {"score": -1, "date": -1, "title": 1, "_id": 1}},
//      { $limit: 10 },
        ], function(err, results){
                if(err){
                        console.log(err);
                        return res.status(500).send("There is an error");
                }
                var unique = {};
                var distinct = [];

                res.send(results);
        });

})



//logic for item page
app.get('/getitem', function(req, res){
        var query = req.query.q;
        //db.bind('reports');

        db.collection("reports").aggregate(
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

})

///break off onto a nesssw resource get file renders layouts page formating from additional file




// Code fos report info page
app.get('/report', function(req, res) {
//      db.bind('reports');
        db.collection("reports").find({'parsed_metadata.ordercode': req.query.id}).toArray(function(err, items) {
//      title
        var title = items[0]['parsed_metadata']['title'];
        var rptid = items[0]['parsed_metadata']['ordercode'];
        var dates = [];
        var sourcevar = [];
        var urlvar = [];


        items.forEach(function(it){
//          sourcevar += it['parsed_metadata']['source'] + "<br/>"
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
//          dates += it['parsed_metadata']['date'] + "<br/>"
dates.push(it['parsed_metadata']['date']);
});
        var dateTxt = "";
        uniq(dates).forEach(function(d){
                dateTxt += d + "<br/>"
        });
        
        
        

        res.send("<h1>" + items[0]['parsed_metadata']['title'] + "</h1>" +
                "<h2>Order Code</h2>" + rptid +
                // "<h2>Sources</h2>" + sourcevarTxt +
                // "<h2>URL Source</h2>" + urlvarTxt +
                 "<h2>Dates</h2>" + dateTxt);

//      res.send(items);
});
});

var port;

if (process.argv.length >= 2) {
    if (process.argv[2] == 'test') {
	port = 8081;
    } else if (process.argv[2] == 'deploy') {
	port = 8080;
    }
}

if (!port) {
    console.log("Please specify 'test' or 'deploy'");
} else {
    MongoClient.connect(config.mongo, {
	db: {native_parser: true},
	replSet: {connectWithNoPrimary: true}
    }, function(err,thedb){
	if(err) console.log(err);
	console.log("connected!");
	db = thedb;
    });

    var serv = http.createServer(app).listen(port, function(){
	console.log('CRSReports App Online');
    });
}
