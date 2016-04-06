
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


exports.signup = function(req, res){
  res.render('signup', { title: '' });
};

exports.login = function(req, res){
  res.render('login', { title: '' });
};

exports.twitterhome = function(req, res){

	if(req.session.userId){
  		res.render('twitterhome', { userId: req.session.userId });
  	}else{
  		res.redirect('/');
  	}
};
