var loopback = require('loopback');
var app = require('../../server/server');
var async = require('async');

module.exports = function (Question) {

	Question.observe('before save', function isInDb(ctx, next) {

		var PoemUser = app.models.PoemUser;
		var Lesson = app.models.Lesson;
		var PoemUserId = ctx.instance.id_author;
		var LessonId = ctx.instance.id_lesson;


		async.parallel([
			// function (callback) {
			// 	PoemUser.exists(PoemUserId, function (err, exists) {
			// 		err = exists ? err : true;
			// 		callback(err, "poemuser " + PoemUserId);
			// 	});
			// },

			function (callback) {
				Lesson.exists(LessonId, function (err, exists) {
					err = exists ? err : true;
					callback(err, 'lesson ' + LessonId);
				});
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
