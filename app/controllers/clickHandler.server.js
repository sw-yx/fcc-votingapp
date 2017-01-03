'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function ClickHandler () {
	this.allPolls = function (req,res){
		console.log ('hello from allPolls');
		Polls.find({})
			.exec(function(err,result){
				if(err) throw err;
				return res.json(result);
			})
	}
	this.viewUser = function (req,res){
		console.log ('hello from viewUser');
		var theusername = req.params.id || req.user.twitter.username;
		Users.findOne({'twitter.username' : theusername})
			.exec(function(err,result){
				if(err) throw err;
				return res.json(result);
			})
	}
	this.getClicks = function (req, res) {
		console.log ('hello from getClicks');
		Polls
			.findOne({ 'id': req.params.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) throw err;
				return res.json(result);
			});
	};


	this.addClick = function (req, res) {
		var incstring = 'options.optname: ' + req.params.option;
		console.log ('hello from addClick: ' + incstring);
		Polls
			.findOneAndUpdate({ 'id': req.params.id , 'options.optname': req.params.option}, { $inc: { "options.$.optval": 1 } })
			//.findOneAndUpdate({ 'twitter.id': req.user.twitter.id }, { $inc: { 'nbrClicks.clicks': 1 } })
			//.then(function(result){
			.exec(function (err, result) {
					if (err) { throw err; }
					//res.json(result);
					return res.redirect('/poll#' + req.params.id)
				}
			);
	};

	//to change to a delete function
	this.deletePoll = function (req, res) {
		console.log ('hello from deletePoll');
		
		// if (req.user.twitter.username == poll.creator) {
		// 		} else {
		// 			res.json('you are not the creator')
		// 		}
		Polls
			.findOneAndRemove({ 'id': req.params.id })
			.exec(function (err, result) {
					if (err) { throw err; }
					Users.findOne({ 'twitter.username': req.user.twitter.username }, function (err, user) {
							if (err) throw err; //should already be authenticated
							var newpolls = [];
							for (var i = 0; i < user.polls.length; i++) { 
								if(user.polls[i].id != req.params.id) {newpolls.push(user.polls[i]);}
							}
							Users
								.findOneAndUpdate({ 'twitter.username': req.user.twitter.username}, { "polls": newpolls })
								.exec(function (err, result) {
										if (err) { throw err; }
										console.log ('deleted poll from user profile');
									}
								);
						})
					return res.redirect('/profile');
				}
			);
	};
	
	
	this.addPollOption = function (req, res) {
		console.log ('hello from addPollOption');
		Polls.findOne({ 'id': req.body.id }, function (err, poll) {
				if (err) throw err;
				var theoptions = [];
				var javascriptisstupid = req.body.option;
				theoptions = poll.options;
				console.log(theoptions);
				theoptions.push({optname:javascriptisstupid,optval:1});
				console.log(theoptions);
				Polls
					.findOneAndUpdate({ 'id': req.body.id}, { "options": theoptions })
					.exec(function (err, result) {
							if (err) { throw err; }
							console.log ('hello from addPollOption');
							return res.redirect('/poll#' + req.body.id);
						}
					);
		})
	}
	
	this.createPoll = function (req, res) {
		console.log('hello from createPoll');
		//Polls.findOne({ 'name': req.params.name }, function (err, poll) {
		Polls.findOne({ 'name': req.body.name }, function (err, poll) {
				if (err) throw err;

				if (poll) {return res.json(poll);} else {
					var newPoll= new Polls();
					console.log('creating new poll');
					newPoll.creator = req.user.twitter.username;
					newPoll.id = newPoll._id;
					//newPoll.name = req.params.name;
					newPoll.name = req.body.name;
					//if(typeof req.params.options != 'undefined') {
					if(typeof req.body.options != 'undefined') {
						var accumulator = [];
						//req.params.options.split(",").forEach(function(entry) {
						req.body.options.split(",").forEach(function(entry) {
						    accumulator.push({optname: entry, optval: 0});
						});
						newPoll.options = accumulator;
					} else {
						newPoll.options = [{ optname: 'Default option A', optval: 0 },{ optname: 'Default option B', optval: 0 },];
					}
					var today = new Date();// var dd = today.getDate();
					console.log('assigned date is ' + today);
					newPoll.date_created = today;//dd;
					console.log(newPoll);
					
					newPoll.save(function (err) {
						if (err) throw err;
						//add it to the user profile
						Users.findOne({ 'twitter.username': req.user.twitter.username }, function (err, user) {
							if (err) throw err; //should already be authenticated
							console.log('user');
							console.log(user);
							var thepolls = user.polls;
							thepolls.push({id:newPoll.id,name:newPoll.name});
							Users
								.findOneAndUpdate({ 'twitter.username': req.user.twitter.username}, { "polls": thepolls })
								.exec(function (err, result) {
										if (err) { throw err; }
										console.log ('added poll to user profile');
									}
								);
						})
						
						return res.redirect('/poll#' + newPoll.id)
					});
				}
			});
	};
}

module.exports = ClickHandler;
