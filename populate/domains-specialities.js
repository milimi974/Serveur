var async = require('async');

module.exports = function (app, cb) {
  var Domain = app.models.domain;
  var Speciality = app.models.speciality;
  var listDomainSpeciality = require('./domains-specialities.json');
  var domainsCount = 0, specialitiesCount = 0;
  async.each(listDomainSpeciality, insertDomain, joinDomains);

  function insertDomain(domainItem, callback) {
    Domain.create({ "label": domainItem.label, "cip_code": domainItem.cip_code }, function (err, dom) {
      if (err)
        callback(err);
      else {
        domainsCount++;
        createSpecialities(domainItem["children"], dom.id, callback);
      }
    });
  }

  function createSpecialities(specialities, domainId, domainCallback) {
    async.each(specialities, function (specialityItem, callback) {
      Speciality.create({ "label": specialityItem.label, "cip_code":specialityItem.cip_code, "id_domain": domainId }, function (err) {
        if (err) 
          callback(err);
        else {
          specialitiesCount++;
          callback();
        }
      });
    }, function (err) {
      if (err) console.log(err.message);
      domainCallback();
    });
  }

  function joinDomains(err) {
    if (err) console.log(err.message);
    console.log("\n- " + domainsCount + " domains and " + specialitiesCount + " specialities inserted in the database.");
    cb();
  }
}