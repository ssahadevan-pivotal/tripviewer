exports.index = function(req, res){
  if(req.session && req.session.access_token) {
    res.render('app', {loggedIn: true});
  } else {
    res.render('index');
  }
}

exports.force_https = function(req, res, next) {
  if(req.headers['x-forwarded-proto'] != 'https') {
    res.redirect('https://' + req.headers.host + req.path);
  } else {
    next();
  }
}