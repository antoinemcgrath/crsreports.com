
var express = require('express');
var app = express();
var httpApp = express();
////var sqlite3 = require('sqlite3').verbose(); -Okay2delet 2016 march 10 if nothing bad happens b4

//unhashed for sitedown notice, must exist for full site
//var config = require('./config.json')
var fs = require('fs');
var privateKey = fs.readFileSync('ssl/privkey.pem');
var certificate = fs.readFileSync('ssl/fullchain.pem');
var https = require('https');
var http = require('http');
//var helmet = require('helmet');
var constants = require('constants');

//var bodyParser = require('body-parser');

//unhashed for sitedown notice, must exist for full site
//var MongoClient = require('mongodb').MongoClient;

//unhashed for sitedown notice, must exist for full site
//var ReadPreference = require('mongodb').ReadPreference;

httpApp.get("*", function(req,res,next) {
   res.redirect("https://crsreports.com" + req.path);
});

var db = null;

//unhashed for sitedown notice, must exist for full site
//MongoClient.connect(config.mongo,
//   {
//      db: {native_parser: true},
//      replSet: {connectWithNoPrimary: true}
//   }, function(err,thedb){
//   if(err) console.log(err);
//   db = thedb;
//});

var path = require('path');

function uniq(a) {
	var seen = {};
	return a.filter(function(item) {
		return seen.hasOwnProperty(item) ? false : (seen[item] = true);
	});
}

//app.use(helmet());
//httpApp.use(helmet());
//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);
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

https.createServer({
   key: privateKey,
   cert: certificate,
   secureProtocol: 'SSLv23_method',
   secureOptions: constants.SSL_OP_NO_SSLv3,
   ciphers: [
"ECDHE-RSA-AES256-SHA384",
    "DHE-RSA-AES256-SHA384",
    "ECDHE-RSA-AES256-SHA256",
    "DHE-RSA-AES256-SHA256",
    "ECDHE-RSA-AES128-SHA256",
    "DHE-RSA-AES128-SHA256",
    "HIGH",
    "!aNULL",
    "!eNULL",
    "!EXPORT",
    "!DES",
    "!RC4",
    "!MD5",
    "!PSK",
    "!SRP",
    "!CAMELLIA"
   ].join(':')
}, app).listen(3000, function () {
	//var host = server.address().address;
	//var port = server.address().port;
	console.log('CRSReports App listening on SSL');
});

var serv = http.createServer(httpApp).listen(8080, function(){
   console.log('CRSReports App listening on HTTP');
});
