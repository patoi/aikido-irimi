// registration route
'use strict';

var limitPromise = require('../promises/limit.promise');
var quartersCount = require('../promises/quarters.promise');

module.exports = function(Q, winston, config, ses, dbReg, regService) {

  var Q = Q,
    winston = winston,
    config = config,
    ses = ses,
    dbReg = dbReg,
    regService = regService;

  // DI quarters accomodation counter
  var quartersCountObj = quartersCount(Q, winston, dbReg);

  // check free rooms
  var checkFreeRooms = function(reg) {
    var deferred = Q.defer();
    var result = {
      'javorka': {
        'd1': 0,
        'd2': 0,
        'd3': 0
      },
      'blathy': {
        'd1': 0,
        'd2': 0,
        'd3': 0
      }
    };
    quartersCountObj(result)
      .then(function(result) {
        winston.info("occupied rooms", result);
        if (reg.quarters === 'javorka') {
          if ((reg.d1 && result.javorka.d1 >= config.quarters.javorkaLimit) ||
            (reg.d2 && result.javorka.d2 >= config.quarters.javorkaLimit) ||
            (reg.d3 && result.javorka.d3 >= config.quarters.javorkaLimit)) {
            // there is no free room
            winston.info("there is not more free room in javorka", result);
            return deferred.reject(Error('v.quarters.full'));
          }
        } else if (reg.quarters === 'blathy') {
          if ((reg.d1 && result.blathy.d1 >= config.quarters.blathyLimit) ||
            (reg.d2 && result.blathy.d2 >= config.quarters.blathyLimit) ||
            (reg.d3 && result.blathy.d3 >= config.quarters.blathyLimit)) {
            // there is no free room
            winston.info("there is not more free room in blathy", result);
            return deferred.reject(Error('v.quarters.full'));
          }
        } else {
          delete reg.d1;
          delete reg.d2;
          delete reg.d3;
        }
        return deferred.resolve(reg);
      });
    return deferred.promise;
  };

  // query email
  var checkUniqueEmail = function(reg) {
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
  var menuLimitPromise = limitPromise(Q, winston, dbReg,
    config.menuLimit, {
      $where: function() {
        return this.menu !== undefined;
      }
    },
    'v.menu.limit',
    function(reg) {
      return reg.menu || !reg.name;
    }
  );

  // insert registration
  var dbInsertReg = function(reg) {
    winston.info('Insert reg.: ', reg);
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
    var deferred = Q.defer();

    if (process.env.NODE_ENV === 'ci') {
      console.log("CI: do not send email");
      deferred.resolve(newDoc);
    } else {

      // email admin and user
      ses.sendEmail({
        Source: config.email.from,
        Destination: {
          ToAddresses: [newDoc.email],
          BccAddresses: [config.email.bcc]
        },
        Message: {
          Subject: {
            Data: config.email.subject + ' - ' + newDoc.name +
              ' - reg. kód: ' + newDoc._id
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
          winston.info('Email sent to reg.: ' + newDoc.email + ', ' +
            newDoc._id);
          return deferred.resolve(newDoc);
        }
      });
    }
    return deferred.promise;
  };

  return {
    registration: function(req, res) {
      winston.info('registration in', req.body);
      // transform registration data
      var reg = regService.transform(req.body);
      // delete calculated value from reg. page
      delete reg.isMenuLimitExceeded;
      delete reg.price;
      // validate registration data
      regService.validate(reg);
      // validate unique registration
      checkUniqueEmail(reg)
        .then(menuLimitPromise)
        .then(checkFreeRooms)
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
