require('events').EventEmitter.defaultMaxListeners = Infinity;

var app = require('./server');
var ds = app.datasources.poem;

var args = process.argv.slice(2);
if (args.length > 0) {
  ds.automigrate(args, function (err) {
    if (err) throw err;
    console.log('Looback tables re-created in the database for models : ', args);
  });
} else {
  ds.automigrate(function (err) {
    if (err) throw err;
    console.log('Looback tables all re-created in the database.');
  });
}