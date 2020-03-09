var app = require('../../server/server');
var request = require('request');

module.exports = function (Poemuser) {

  /**
   * Check the credentials on the CSDC databases, then create a token
   * @param {string} email The user identifier
   * @param {string} password The user password
   * @param {Function(Error, string)} callback
   */
  Poemuser.loginViaCSDC = function (email, password, callback) {

    // CSDC API call
    console.log("Checking credentials via CSDC...");

    checkCSDCcredentials(email, password, function (err) {
      if (err) {
        console.log("\t CSDC failed!");
        console.log(err);
        var e = new Error('Please verify that '+email+' is registered on cs-dc.org.');
        e.body = err;
        callback(e, null);
        return;
      } else {
        console.log("\t CSDC ok!");
      }

      console.log("Looking for user in POEM databases...");
      Poemuser.findOne({ where: { email: email } }, function (err, user) {
        if (err) callback(err, null);
        if (!user) {
          console.log("\t user not found.");
          callback(new Error('Could not find user \'' + email + '\''), null);
          return;
        }

        console.log("\t user OK!");
        console.log("Looking for token...");
        user.accessTokens.create({}, function (err, token) {
          if (err) callback(err, null);

          console.log("\t token OK!");
          console.log("Looking for language...");
          app.models.Language.findOne({ where: { code: user.favoured_langage_display } }, function (err, lang) {
            if (err || !lang) {
              console.log("\t language not found.");
              console.log(err);
              callback(new Error('Could not find language \'' + user.favoured_langage_display + '\''), null);
              return;
            }

            console.log("\t language OK!");
            callback(null, { "token": token.id, "username": user.username, "userId": user.id, "language": lang.code });
          });

        });
      });

    });


  };

  /**
   * Create a new user on CSDC database, then on the localDatabase
   * @param {string} email The user identifier
   * @param {string} username The user nickname
   * @param {string} name The user first name
   * @param {string} surname The user last name
   * @param {string} favoured_langage_display The language used to present the interface of the application
   * @param {string} favoured_langage_content The language used to default filter lessons
   * @param {string} password The user password
   * @param {Function(Error, string)} callback
   */

  Poemuser.registerViaCSDC = function (email, username, name, surname, favoured_langage_display, favoured_langage_content, password, status, callback) {
    username = username || name + '.' + surname;

    registerToCSDCdatabase(function (err) {
      if (err) callback(err, null);

      Poemuser.create({
        email: email,
        username: username,
        name: name,
        surname: surname,
        favoured_langage_display: "fr",
        favoured_langage_content: "fr",
        password: password,
        status: status
      }, function (err, user) {
        if (err) callback(err, null);

        user.accessTokens.create({}, function (err, token) {
          if (err) callback(err, null);

          callback(null, { "token": token.id, "username": username, "userId": user.id, "language": "fr" });
        });

      });
    });
  };

  function checkCSDCcredentials(email, password, callback) {
    var csdcurl = 'http://beta.cs-dc.org/campus/api/login';
    var param = { 'email': email, 'password': password };
    // request.post(csdcurl, { json: true, body: param }, function (err, res, body) {

    //   if (!err && res.statusCode != 200)
    //     err = body;

    //   callback(err);
    // });
    callback(null);
  }

  function registerToCSDCdatabase(callback) {
    callback();
  }
}
