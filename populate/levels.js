var async = require('async');

module.exports = function (app) {
  var Level = app.models.study_level;

  var listLevels = require('./levels_data.json');
  var levelCount = 0;
  async.each(listLevels, insert, join);

  function insert (item, callback) {
    Level.create(item, function (err, obj) {
      if (!err)
        levelCount++;
      callback(err);
    });
  }

  function join (err) {
    if (err) console.log(err.message);
    console.log("\n- " + levelCount + " levels inserted in the database.");
  }
}