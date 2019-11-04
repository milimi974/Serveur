var loopback = require('loopback');
var app = require('../../server/server');

var async = require('async');

module.exports = function (Lessongroup) {


	Lessongroup.observe('before save', function isInDb(ctx, next) {
		var lessons = ctx.instance.lessons;
		var lessonModel = app.models.lesson;

		async.each(lessons,
			function (lesson, callback) {
				lessonModel.exists(lesson, function (err, exists) {
					if (exists) 
						callback();
					else 
						callback("lesson " + lesson);
				});
			},
			function (err) {
				var error = null;
				if (err != null) {
					error = new Error();
					error.name = "fk does not exists";
					error.status = 404; // don't know wich code use
					error.message = err;
				}
				next(error);
			}
		);
	});
};
