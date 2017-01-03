'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	//github: {
	twitter: {
		id: String,
		displayName: String,
		username: String,
        followcount: Number
	},
   polls: [{id:String,name:String}]
});

module.exports = mongoose.model('User', User);
