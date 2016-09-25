var express = require('express');
var app = express();
var path = require('path');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');

//APP CONFIGURATION
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var apiRouter = express.Router();

app.use('/api', apiRouter);

app.set('port', 9090);

app.use(express.static(__dirname + '/public'));

app.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/views/admin.html'));
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

app.listen(app.get('port'));

console.log("here we go");
