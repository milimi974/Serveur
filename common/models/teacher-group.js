var async = require('async');
var loopback = require('loopback');
var app = require('../../server/server');

module.exports = function (Teachergroup) {
	// operation hook definition
	Teachergroup.observe('before save', function isInDb(ctx, next) {

		var Teacher = app.models.Teacher;
		var teachers = ctx.instance.teachers;

		async.each(teachers,
			function (teacher, callback) {
				Teacher.exists(teacher, function (err, exists) {
					if (exists) 
						callback();
					else 
						callback("teacher " + teacher);
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

