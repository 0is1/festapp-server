var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var routes = require('./routes');
var mongoose = require('mongoose');
//var mb = require('musicbrainz');

var lastfm = require('./lib/lastfm_artist_search')


var mongourl = process.env.MONGOLAB_URI || 'mongodb://localhost/festapp-dev';
mongoose.connect(mongourl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var apiVersion = '/v1';
// Accounts which may do POST and PUT -requests to api
var accounts = ['admin:admin'];
var accessFilter = require('./lib/access_filter');

var app = express();

app.use(logger('short'));
app.use(bodyParser());
app.use('/api', accessFilter(accounts, apiVersion));
app.use('/public', express.static(__dirname + '/public'));

routes(app, apiVersion);

var port = Number(process.env.PORT || 8080);
http.createServer(app).listen(port);
console.log('Running at port '+port);

app.get('/api' + apiVersion + '/lastfm/search/:artist?', function(req, res) {
	var artist = req.params.artist

	// writes a json response
	lastfm.search(artist, res);

  });

module.exports = app;

