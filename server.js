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

// registration
app.route('/api/registrations')
  .post(function(req, res) {
    winston.info('registration in', req.body);
    // transform registration data
    var reg = regService.transform(req.body);
    try {
      // validate registration data
      regService.validate(reg);
      // validate unique registration
      dbReg.find({
          'email': reg.email
        },
        function(err, docs) {
          if (docs.length === 0) {
            // registration is unique

            // calculating price
            reg.price = regService.getPrice(reg, config.deadlineDiscount);

            dbReg.insert(reg, function(err, newDoc) {
              if (err) {
                res.json({
                  'errorCode': 'e.reg.insert'
                });
              } else {
                // registration code is _id
                winston.info('registration out', newDoc);
                // email admin and user
                ses.sendEmail({
                  Source: config.email.from,
                  Destination: {
                    ToAddresses: [reg.email],
                    BccAddresses: [config.email.bcc]
                  },
                  Message: {
                    Subject: {
                      Data: config.email.subject
                    },
                    Body: {
                      Text: {
                        Data: regService.toText(newDoc)
                      }
                    }
                  }
                }, function(err, data) {
                  if (err) {
                    winston.error('SMTP: reg. send: ' + err.message);
                  } else {
                    winston.info('Email sent to from reg.: ' + reg.email + ", " + reg._id);
                  }
                });
                res.json(newDoc);
              }
            });
          } else {
            res.json({
              'errorCode': 'v.reg.not.unique'
            });
          }
        });
    } catch (e) {
      winston.error(e.message);
      res.json({
        'errorCode': e.message
      });
    }


  })
  .get(function(req, res) {
    // get all registration data
    winston.info('registration download, user: ', req.query.key);
    if (req.query.key === config.adminKey) {
      dbReg.find({}, function(err, docs) {
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
                Data: JSON.stringify(docs)
              }
            }
          }
        }, function(err, data) {
          if (err) {
            winston.error('SMTP: all reg. data send: ' + err.message);
          } else {
            winston.info('Email sent from all reg. data!');
          }
        });
      });
    } else {
      res.sendStatus(404);
    }
  });

app.listen(3000, function() {
  winston.info('Listen on port 3000 NODE_ENV: ' + process.env.NODE_ENV);
});
