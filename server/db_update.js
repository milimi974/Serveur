require('events').EventEmitter.defaultMaxListeners = Infinity;

var app = require('./server');
var ds = app.datasources.poem;

ds.isActual(function (err, actual) {
  if (actual) {
    console.log('Loopbak tables definitions are already up to date in the database.')
    return;
  }

  // alter or creates tables for all models
  ds.autoupdate(function (err) {
    if (err) throw err;
    console.log('Looback tables definitions updated in the database.');
  });
});
