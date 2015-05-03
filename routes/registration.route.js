// registration route
'use strict';

var menuLimitPromise = require('../menu.limit.promise');

module.exports = function(Q, winston, config, ses, dbReg, regService) {

  var Q = Q,
    winston = winston,
    config = config,
    ses = ses,
    dbReg = dbReg,
    regService = regService;

  // query email
  var checkUniqueEmail = function(reg) {
    console.log('checkUniqueEmail');
    var deferred = Q.defer();
    dbReg.find({
      'email': reg.email
    }, function(err, docs) {
      if (err) {
        return deferred.reject(err);
      } else {
        if (docs.length === 0) {
          // registration is unique
          // calculating price
          reg.price = regService.getPrice(reg);
          return deferred.resolve(reg);
        } else {
          return deferred.reject(new Error('v.reg.not.unique'));
        }
      };
    });
    return deferred.promise;
  };

  // check menu limit
  var menuLimit = menuLimitPromise(Q, winston, config, dbReg);

  // insert registration
  var dbInsertReg = function(reg) {
    console.log('dbInsertReg');
    var deferred = Q.defer();
    dbReg.insert(reg, function(err, doc) {
      if (err) {
        return deferred.reject(err);
      } else {
        return deferred.resolve(doc);
      };
    });
    return deferred.promise;
  };

  // sent registration email
  var sendRegistrationEmail = function(newDoc) {
    console.log('sendRegistrationEmail');
    var deferred = Q.defer();
    // email admin and user
    ses.sendEmail({
      Source: config.email.from,
      Destination: {
        ToAddresses: [newDoc.email],
        BccAddresses: [config.email.bcc]
      },
      Message: {
        Subject: {
          Data: config.email.subject + ' - ' + newDoc.name + ' - reg. kód: ' + newDoc._id
        },
        Body: {
          Html: {
            Data: regService.toHtml(newDoc)
          }
        }
      }
    }, function(err, data) {
      if (err) {
        return deferred.reject(err);
      } else {
        winston.info('Email sent to reg.: ' + newDoc.email + ', ' + newDoc._id);
        return deferred.resolve(newDoc);
      }
    });
    return deferred.promise;
  };

  return {
    registration: function(req, res) {
      winston.info('registration in', req.body);
      // transform registration data
      var reg = regService.transform(req.body);
      // validate registration data
      regService.validate(reg);
      // validate unique registration
      checkUniqueEmail(reg)
        .then(menuLimit)
        .then(dbInsertReg)
        .then(sendRegistrationEmail)
        .then(function(newDoc) {
          winston.info('registration out', newDoc);
          res.json(newDoc);
        })
        .catch(function(e) {
          winston.error(e.message);
          if (e.message == 'v.reg.not.unique') {
            res.status(409).json({
              'errorCode': 'v.reg.not.unique'
            });
          } else {
            res.status(500).json({
              'errorCode': e.message
            });
          }
        }).done();
    },
    readAll: function(req, res) {
      // get all registration data
      winston.info('registration download, user: ', req.query.key);
      if (req.query.key === config.adminKey) {
        dbReg.find({}).sort({
          time: 1
        }).exec(function(err, docs) {
          ses.sendEmail({
            Source: config.email.from,
            Destination: {
              ToAddresses: [config.email.bcc]
            },
            Message: {
              Subject: {
                Data: 'Minden regisztráció'
              },
              Body: {
                Text: {
                  Data: regService.getAllRegAsCSV(docs)
                }
              }
            }
          }, function(err, data) {
            if (err) {
              winston.error('SMTP: all reg. data send: ' + err.message);
            } else {
              winston.info('Email sent from all reg. data!');
            }
            res.sendStatus(200);
          });
        });
      } else {
        res.sendStatus(404);
      }
    }
  };
};
