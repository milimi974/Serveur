var loopback = require('loopback');
var app = require('../../server/server');
var async = require('async');

module.exports = function (Lesson) {

	Lesson.observe('before save', function domaineInDb(ctx, next) {

		var idCourseMaterial = ctx.instance.id_course_material;
		var idThumbnail = ctx.instance.id_thumbnail;
		var idSpeciality = ctx.instance.id_speciality;
		var idAuthor = ctx.instance.id_author;

		var ressource = app.models.Ressource;
		var speciality = app.models.Speciality;
		var poemUser = app.models.PoemUser;

		async.parallel([
			function (callback) {
				if (!idCourseMaterial)
					callback(null);
				else {
					ressource.exists(idCourseMaterial, function (err, exists) {
						err = exists ? err : true;
						callback(err, "CourseMaterial " + idCourseMaterial);
					})
				}
			},

			function (callback) {
				if (!idThumbnail)
					callback(null);
				else {
					ressource.exists(idThumbnail, function (err, exists) {
						err = exists ? err : true;
						callback(err, "Thumbnail " + idThumbnail);
					})
				}
			},

			function (callback) {
				poemUser.exists(idAuthor, function (err, exists) {
					err = exists ? err : true;
					callback(err, "Author " + idAuthor);
				})
			},

			function (callback) {
				speciality.exists(idSpeciality, function (err, exists) {
					err = exists ? err : true;
					callback(err, "Speciality " + idSpeciality);
				})
			}],

			//callback function
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
			}
		);
	});
}

