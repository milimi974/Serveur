var loopback = require('loopback');
var app = require('../../server/server');

var async = require('async');

module.exports = function (Session) {


	Session.observe('before save', function isInDb(ctx, next) {
		var studentsId = ctx.instance.students;
		var collaboratorsId = ctx.instance.collaborators;
		var coursesId = ctx.instance.courses;
		var students = app.models.student_group;
		var collaborators = app.models.teacher_group;
		var courses = app.models.lesson_group;


		async.parallel([
			function (callback) {
				students.exists(studentsId, function (err, exists) {
					err = exists ? err : true;
					callback(err, "students " + studentsId);
				});
			},

			function (callback) {
				collaborators.exists(collaboratorsId, function (err, exists) {
					err = exists ? err : true;
					callback(err, "collaborators " + collaboratorsId);
				});
			},

			function (callback) {
				courses.exists(coursesId, function (err, exists) {
					err = exists ? err : true;
					callback(err, "courses " + coursesId);
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


