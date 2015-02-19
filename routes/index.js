var nconf = require('nconf');


exports.index = function(req, res, next){
  if(req.isAuthenticated()) {
    res.render('summary', {loggedIn: true, menu: 'summary'});
  } else {
    res.render('index');
  }
};


exports.redirect = function (req, res, next) {
  res.redirect('/');
};


exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};


exports.logout = function(req, res, next) {
  req.logout();
  res.redirect('/');
};


exports.trips = function(req, res, next){
  res.render('trips', {loggedIn: true, menu: 'trips', mapboxAccessToken: nconf.get('MAPBOX_ACCESS_TOKEN')});
};


exports.trip = function(req, res, next){
  res.render('trip', {trip_id: req.params.id, loggedIn: true, menu: 'trips', mapboxAccessToken: nconf.get('MAPBOX_ACCESS_TOKEN')});
};


exports.vehicles = function(req, res, next){
  res.render('vehicles', {loggedIn: true, menu: 'vehicles'});
};


exports.force_https = function(req, res, next) {
  if(req.headers['x-forwarded-proto'] != 'https') {
    res.redirect('https://' + req.headers.host + req.path);
  } else {
    next();
  }
};


exports.check_dev_token = function(req, res, next) {
  if(process.env.TOKEN) {
    req.profile.accessToken = process.env.TOKEN;
  }
  next();
};
