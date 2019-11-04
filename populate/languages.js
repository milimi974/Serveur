var async = require('async');

module.exports = function (app) {
  var Language = app.models.language;

  var listLanguages = require('./languages_data.json')
  var languageCount = 0;
  async.each(listLanguages, insert, join);

  function insert (item, callback) {
    Language.create(item, function (err, obj) {
      if (!err)
        languageCount++;
      callback(err);
    });
  }

  function join (err) {
    if (err) console.log(err.message);
    console.log("\n- " + languageCount + " languages inserted in the database.");
  }
}