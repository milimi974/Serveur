var loopback = require('loopback');
var app = require('../../server/server');
var async = require('async');


module.exports = function (Submittedanswer) {

	Submittedanswer.observe('before save', function idInDb(ctx, next) {
		var questionId = ctx.instance.id_question;
		var authorId = ctx.instance.id_author;
		var poemUser = app.models.PoemUser; //	question.js lesson.js evaluation.js
		var question = app.models.Question;


		async.parallel([
			function (callback) {
				poemUser.exists(authorId, function (err, exists) {
					err = exists ? err : true;
					callback(err, "poemUser " + authorId);
				})
			},

			function (callback) {
				question.exists(questionId, function (err, exists) {
					err = exists ? err : true;
					callback(err, "question " + questionId);
				})
			}
		],

			function (err, result) {
				if (!err)
					next();
				else {
					var error = new Error();
					error.name = "fk does not exists";
					error.status = 404; // don't know wich code use
					error.message = result[result.length - 1];
					next(error);
				}
			});
	});
};

