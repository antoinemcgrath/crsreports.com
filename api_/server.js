
var express = require('express'),
    app = express(),
    port = process.env.PORT || 8085,
    mongoose = require('mongoose'),
    Task = require('./api/models/api_Model'), //created model loading here
    bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:29017/crsTest');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/api_Routes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);


app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found\t, \ntry again.'})
});
