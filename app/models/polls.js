'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
	id: String,
	name: String,
	options: [{ optname: String, optval: Number }],
    date_created: Date,
    creator: String
});

module.exports = mongoose.model('Poll', Poll);


/*
poll-id = string
poll-name = string
poll-options = array of options and votes
date-creation
*/