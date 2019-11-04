var async = require('async');
var loopback = require('loopback');
var app = require('../../server/server');

module.exports = function (Studentgroup) {
	// operation hook definition
	Studentgroup.observe('before save', function isInDb(ctx, next) {

		var Student = app.models.Student;
		var students = ctx.instance.students;

		async.each(students,
			function (student, callback) {
				Student.exists(student, function (err, exists) {
					if (exists)
						callback();
					else
						callback("student " + student);
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
			});

	});
};

