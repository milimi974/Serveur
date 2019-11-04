var loopback = require('loopback');
var app = require('../../server/server');

module.exports = function (Speciality) {

	Speciality.observe('before save', function domaineInDb(ctx, next) {
		var domainId = ctx.instance.id_domain;
		var domain = app.models.Domain;

		domain.exists(domainId, function (err, exists) {
			if (exists)
				next();
			else {
				var err = new Error();
				err.name = "fk does not exists";
				err.status = 404; // don't know wich code use
				err.message = "domain " + domainId;
				next(err);
			}
		});

	});

};
