'use strict';

var express = require('express');
var config = require('./config.' + process.env.NODE_ENV);
var app = express();
var fs = require('fs')
var morgan = require('morgan');
var bodyParser = require('body-parser');
var winston = require('winston');
var nodemailer = require('nodemailer');
var Datastore = require('nedb');
var regService = require('./reg.service.js');

// init database
var dbReg = new Datastore({
  filename: __dirname + '/reg.db',
  autoload: true
});

// smtp config
var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.email.from,
    pass: config.email.psw
  }
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

// registration
app.route('/api/regisztraciok')
  .post(function(req, res) {
    winston.info('registration in', req.body);
    // transform registration data
    var reg = regService.transform(req.body);
    try {
      // validate registration data
      regService.validate(reg);
      // validate unique registration
      dbReg.find({
          $or: [{
            'nev': reg.nev
          }, {
            'email': reg.email
          }]
        },
        function(err, docs) {
          if (docs.length === 0) {
            // registration is unique
            dbReg.insert(reg, function(err, newDoc) {
              // registration code is _id
              winston.info('registration out', newDoc);
              // email admin and user
              var mailOptions = {
                from: config.email.from,
                to: reg.email,
                bcc: config.email.bcc,
                subject: config.email.subject,
                text: JSON.stringify(reg)
              };
              smtpTransport.sendMail(mailOptions, function(error, response) {
                if (error) {
                  winston.error(error);
                } else {
                  winston.info('registration email sent: ', response.message);
                }
              });
              res.json(newDoc);
            });
          } else {
            res.json({
              'errorCode': 'v.reg.not.unique'
            });
          }
        });
    } catch (e) {
      res.json({
        'errorCode': e.message
      });
    }


  })
  .get(function(req, res) {
    // get all registration data
    winston.info('registration download', req.query.key);
    if (req.query.key === config.adminKey) {
      dbReg.find({}, function(err, docs) {
        var mailOptions = {
          from: config.email.from,
          to: config.email.cc,
          subject: 'All registration',
          text: JSON.stringify(docs)
        };
        smtpTransport.sendMail(mailOptions, function(error, response) {
          if (error) {
            winston.error(error);
            res.end('registration download smtp error');
          } else {
            console.log('registration download email sent: ' + response.message);
            res.send(docs);
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
