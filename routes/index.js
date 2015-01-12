var nconf = require('nconf');

var oauth2 = require('simple-oauth2')({
  clientID: nconf.get('AUTOMATIC_CLIENT_ID'),
  clientSecret: nconf.get('AUTOMATIC_CLIENT_SECRET'),
  site: 'https://accounts.automatic.com',
  tokenPath: '/oauth/access_token'
});

var authorization_uri = oauth2.authCode.authorizeURL({
  scope: 'scope:trip scope:location scope:vehicle:profile scope:vehicle:events scope:behavior'
});


exports.index = function(req, res, next){
  if(req.session && req.session.access_token) {
    res.render('summary', {loggedIn: true, menu: 'summary'});
  } else {
    res.render('index');
  }
};


exports.authorize = function(req, res, next) {
  res.redirect(authorization_uri);
};


exports.redirect = function (req, res, next) {
  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code
  }, function(e, result) {
    if (e) return next(e);

    // Attach `token` to the user's session for later use
    var token = oauth2.accessToken.create(result);

    req.session.access_token = token.token.access_token;
    req.session.user_id = token.token.user.id;

    res.redirect('/');
  });
};


exports.authenticate = function(req, res, next) {
  if(!req.session || !req.session.access_token) {
    res.redirect('/');
  } else {
    next();
  }
};


exports.logout = function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
};


exports.trips = function(req, res, next){
  res.render('trips', {loggedIn: true, menu: 'trips'});
};


exports.trip = function(req, res, next){
  res.render('trip', {trip_id: req.params.id, loggedIn: true, menu: 'trips'});
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
    req.session.access_token = process.env.TOKEN;
    req.session.user_id = process.env.USER_ID;
  }
  next();
};
