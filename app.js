var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var session = require('express-session');
var passport = require('passport');
var AutomaticStrategy = require('passport-automatic').Strategy;

nconf.env().argv();
nconf.file('./config.json');

var routes = require('./routes');
var api = require('./routes/api');

var app = express();


// Use the AutomaticStrategy within Passport
passport.use(new AutomaticStrategy({
    clientID: nconf.get('AUTOMATIC_CLIENT_ID'),
    clientSecret: nconf.get('AUTOMATIC_CLIENT_SECRET'),
		scope: ['scope:trip', 'scope:location', 'scope:vehicle:profile', 'scope:vehicle:events', 'scope:behavior']
  },
  function(accessToken, refreshToken, profile, done) {
		profile.accessToken = accessToken;
    return done(null, profile);
  }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});


passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: nconf.get('SESSION_SECRET'),
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 31536000000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') !== 'development') {
	app.all('*', routes.force_https);
} else {
	app.all('*', routes.check_dev_token);
}

app.get('/', routes.ensureAuthenticated, routes.index);
app.get('/login', routes.login);
app.get('/trips', routes.ensureAuthenticated, routes.trips);
app.get('/trips/:id', routes.ensureAuthenticated, routes.trip);
app.get('/vehicles', routes.ensureAuthenticated, routes.vehicles);

app.get('/authorize/', passport.authenticate('automatic'));
app.get('/logout/', routes.logout);
app.get('/redirect/', passport.authenticate('automatic', {failureRedirect: '/'}), routes.redirect);

app.get('/api/trips/', routes.ensureAuthenticated, api.trips);
app.get('/api/trips/:id', routes.ensureAuthenticated, api.trip);
app.get('/api/vehicles/', routes.ensureAuthenticated, api.vehicles);

app.get('/download/trips.csv', routes.ensureAuthenticated, api.downloadTripsCSV);

// error handlers
require('./libs/errors')(app);

module.exports = app;
