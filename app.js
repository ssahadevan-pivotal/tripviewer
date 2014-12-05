var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var session = require('express-session');

nconf.env().argv();
nconf.file('./config.json');

nconf.set('AUTOMATIC_SCOPES', 'scope:trip scope:location scope:vehicle:profile scope:vehicle:events scope:behavior');


var routes = require('./routes');
var oauth = require('./routes/oauth');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: nconf.get('SESSION_SECRET'), resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') !== 'development') {
	app.all('*', routes.force_https);
} else {
	app.all('*', routes.check_dev_token);
}

app.get('/', routes.index);
app.get('/trips', oauth.authenticate, routes.trips);
app.get('/trips/:id', oauth.authenticate, routes.trip);
app.get('/vehicles', oauth.authenticate, routes.vehicles);

app.get('/authorize/', oauth.authorize);
app.get('/logout/', oauth.logout);
app.get('/redirect/', oauth.redirect);

app.get('/api/trips/', oauth.authenticate, api.trips);
app.get('/api/trips/:id', oauth.authenticate, api.trip);
app.get('/api/vehicles/', oauth.authenticate, api.vehicles);
app.get('/download/trips.json', oauth.authenticate, api.downloadTripsJSON);
app.get('/download/trips.csv', oauth.authenticate, api.downloadTripsCSV);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if(app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
