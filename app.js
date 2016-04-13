
/**
 * Module dependencies.
 */

var express = require('express')
  , home = require('./routes/home')
  , tweets = require('./routes/tweets')
  , others = require('./routes/others')
  , profile = require('./routes/profile')
  , users = require('./routes/users')
  , http = require('http')
  , path = require('path');
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongoSessionConnectURL = "mongodb://localhost:27017/twitterdb";

var app = express();
app.use(expressSession({
	secret: 'fjklowjafnkvnap',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

// all environments
app.set('port', process.env.PORT || 1100);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', home.index);
app.get('/signup', home.signup);
app.post('/signUpUser', users.signUpUser);

app.get('/login', home.login);
app.post('/loginUser', users.loginUser);
app.post('/logoutUser',users.logoutUser);


app.get('/twitterhome', home.twitterhome);
app.post('/getUserDetails', users.getUserDetails);
app.post('/sendTweet', tweets.sendTweet);
app.post('/sendRetweet', tweets.sendRetweet);

app.post('/fetchNewTweets',tweets.fetchNewTweets);


app.post('/getLeftPanelData', others.getLeftPanelData);
app.post('/getRightPanelUsers', others.getRightPanelUsers);


app.post('/followUser',profile.followUser);
app.post('/unfollowUser', profile.unfollowUser);


app.get('/:id', profile.loadProfile);
app.post('/getFollowingList', others.getFollowingList);
app.post('/getFollowerList', others.getFollowerList);

app.post('/saveProfileChanges', profile.saveProfileChanges);


app.post('/search',others.search);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
