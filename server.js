'use strict';

var aws = require('aws-sdk');
var express = require('express');
var config = require('./config.' + process.env.NODE_ENV);
var app = express();
var fs = require('fs')
var morgan = require('morgan');
var bodyParser = require('body-parser');
var winston = require('winston');
var Datastore = require('nedb');
var regService = require('./reg.service.js');
var Q = require('q');

// init SMTP
aws.config.loadFromPath('./config.aws.json');
var ses = new aws.SES({
  apiVersion: '2010-12-01'
});

// init database
var dbReg = new Datastore({
  filename: __dirname + '/reg.db',
  autoload: true
});

// event log file init
var eventLogStream = fs.createWriteStream(__dirname + '/event.log', {
  flags: 'a'
});

// app log
winston.add(winston.transports.File, {
  filename: __dirname + '/reg.log',
  handleExceptions: true
});

// middleware config
app.use(bodyParser.json());
// public web
app.use(express.static('public'));
// event log init
app.use(morgan('combined', {
  stream: eventLogStream
}));

// create price
app.route('/api/price')
  .post(function(req, res) {
    winston.info('price in', req.body);
    var reg = regService.transform(req.body);
    var price = regService.getPrice(reg, config.deadlineDiscount);
    winston.info('price out', price);
    res.json({
      'price': price
    });
  });

// query email
var checkUniqueEmail = function(reg) {
  console.log("checkUniqueEmail");
  var deferred = Q.defer();
  dbReg.find({
    'email': reg.email
  }, function(err, docs) {
    if (err) {
      console.log('reject');
      return deferred.reject(err);
    } else {
      console.log('resolve', docs);
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

// insert registration
var dbInsertReg = function(reg) {
  console.log("dbInsertReg");
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
  console.log("sendRegistrationEmail");
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
      winston.info('Email sent to reg.: ' + newDoc.email + ", " + newDoc._id);
      return deferred.resolve(newDoc);
    }
  });
  return deferred.promise;
};

// registration
app.route('/api/registrations')
  .post(function(req, res) {
    winston.info('registration in', req.body);
    // transform registration data
    var reg = regService.transform(req.body);
    // validate registration data
    regService.validate(reg);
    // validate unique registration
    checkUniqueEmail(reg)
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
  })
  .get(function(req, res) {
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
  });

// express error handling
app.use(function(e, req, res, next) {
  console.log('err:', e);
  winston.error(e.message);
  res.status(500).json({
    'errorCode': e.message
  });
});

// boot app
var server = app.listen(config.port, function() {
  winston.info('Listen on port ' + config.port + ' NODE_ENV: ' + process.env.NODE_ENV);
});

// shutdown
process.on('SIGTERM', function () {
  winston.info("Shutdown reg application...");
  server.close();
});
