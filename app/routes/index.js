'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var bodyParser = require('body-parser') //http://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();
	/** bodyParser.urlencoded(options)
	 * Parses the text as URL encoded data (whic is how browsers tend to send form data from regular forms set to POST)
	 * and exposes the resulting object (containing the keys and values) on req.body
	 */
	app.use(bodyParser.urlencoded({
	    extended: true
	}));
	
	/**bodyParser.json(options)
	 * Parses the text as JSON and exposes the resulting object on req.body.
	 */
	app.use(bodyParser.json());
	
	app.post("/", function (req, res) {
	    console.log(req.body.user.name)
	});

	app.route('/')
		//.get(isLoggedIn, function (req, res) {
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');//,{ maxAge: 5000 });
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');//,{ maxAge: 5000 });
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile/:username?')
		.get(isLoggedIn,function (req, res) {
			res.sendFile(path + '/public/profile.html');//,{ maxAge: 5000 });
		});
	app.route('/poll')
		.get(function (req, res) {
			res.sendFile(path + '/public/poll.html');
		});
		
	//private api's
	app.route('/api/all')
		.get(clickHandler.allPolls)
	
	app.route('/api/user/:username')
		.get(isLoggedIn, clickHandler.viewUser) //added just to test in browser
		.post(isLoggedIn, clickHandler.viewUser);
		
		
	app.route('/api/new/')
		.post(isLoggedIn, clickHandler.createPoll);

	app.route('/api/add/:id/:option')
		.get(isLoggedIn, clickHandler.addPollOption) //just to test in browser
		.post(isLoggedIn, clickHandler.addPollOption);
		//.post(isLoggedIn, function (req, res) {
		//	//res.json(req.user.twitter);
		//	clickHandler.addPollOption(req.params.id,req.params.option)
		//});

	app.route('/api/delete/:id') // secret api to delete poll
		.get(clickHandler.deletePoll);
		
	app.route('/api/:id/:option')  // this works
		.get(clickHandler.addClick) //added to test
		.post(clickHandler.addClick);
		//.post(function (req, res) {
		//	clickHandler.addClick(req.params.id,req.params.option)
		//});

	app.route('/api/:id')  // this works
		.get(clickHandler.getClicks)
		//.post(isLoggedIn, clickHandler.addClick)
		//.delete(isLoggedIn, clickHandler.resetClicks);
		.delete(isLoggedIn, clickHandler.deletePoll);

		
	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/profile',
			failureRedirect: '/login'
		}));

};
