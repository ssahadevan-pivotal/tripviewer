exports.index = function(req, res){
  if(req.session && req.session.access_token) {
    res.render('summary', {loggedIn: true});
  } else {
    res.render('index');
  }
};


exports.trips = function(req, res){
  res.render('trips', {loggedIn: true});
};


exports.trip = function(req, res){
  res.render('trip', {trip_id: req.params.id, loggedIn: true});
};


exports.force_https = function(req, res, next) {
  if(req.headers['x-forwarded-proto'] != 'https') {
    res.redirect('https://' + req.headers.host + req.path);
  } else {
    next();
  }
}


exports.check_dev_token = function(req, res, next) {
  if(process.env.TOKEN) {
    req.session.access_token = process.env.TOKEN;
  }
  next();
}
