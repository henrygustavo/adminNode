var express = require('express');
var app = express();
var path = require('path');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var config = require('./config');
//APP CONFIGURATION
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//CORS

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-Width, content-type,Authorization');
    next();
});

app.use(morgan('dev'));

//DB conection
mongoose.connect(config.database);

var apiRoutes = require('./app/routes/api')(express);

app.use('/api', apiRoutes);

app.set('port', config.port);

app.use(express.static(__dirname + '/public'));

app.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/views/admin.html'));
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

app.listen(app.get('port'));

console.log("here we go!! port:" + config.port);
