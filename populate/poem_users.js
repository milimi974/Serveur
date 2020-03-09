module.exports = function (app) {
	var users = require('./poem_users.json');
	var PoemUser = app.models.poem_user;
	
	users.forEach(function (t) {
		PoemUser.create(t, function (err, obj) {
			if (err) console.log("\n" + err.message);
			else console.log("\n- " + 1 + " poem_user inserted in the database.");
		})
	});
}
