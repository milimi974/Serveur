var loopback = require('loopback');
var app = require('../../server/server');

var async = require('async');

module.exports = function (Comment) {
	Comment.observe('before save', function isInDb(ctx, next) {
		var author = app.models.poem_user;
		var question = app.models.question;
		var submittedAnswer = app.models.submitted_answer;

		//object can be question or submited answer
		var type = ctx.instance.type_object;
		var idObject = ctx.instance.id_object;
		var idAuthor = ctx.instance.id_author;

		async.parallel([
			function (callback) {
				author.exists(idAuthor, function (err, exists) {
					err = exists ? err : true;
					callback(err, "Author " + idAuthor);
				})
			},
			function (callback) {
				if (type == 'question') {
					// console.log('question');
					question.exists(idObject, function (err, exists) {
						err = exists ? err : true;
						callback(err, "question " + idObject);
					});
				}
				else if (type == 'answer_submitted') {
					// console.log('answer_submitted');
					submittedAnswer.exists(idObject, function (err, exists) {
						err = exists ? err : true;
						callback(err, "submittedAnswer " + idObject);
					});
				}
				else {
					callback(true, "object " + type + " does not exist");
				}
			}],
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
