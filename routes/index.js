exports.index = function(req, res){
  if(req.session && req.session.access_token) {
    res.render('app', {loggedIn: true});
  } else {
    res.render('index');
  }
}
