var app = require('../server/server');
require('events').EventEmitter.prototype._maxListeners = 1000;

var users = require('../populate/poem_users.js');
var levels = require('../populate/levels.js');
var languages = require('../populate/languages.js');
var domains = require('../populate/domains-specialities.js');
var lessons = require('../populate/lessons-questions.js')

users(app)
levels(app)
languages(app)
domains(app, function () { 
	lessons(app)
});
