'use strict';

var express = require('express');
var config = require('./config_eles');
var app = express();
var fs = require('fs')
var morgan = require('morgan');
var bodyParser = require('body-parser');
var winston = require('winston');
var nodemailer = require('nodemailer');
var Datastore = require('nedb'),
  dbReg = new Datastore({
    filename: __dirname + '/reg.db',
    autoload: true
  });

var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.email.from,
    pass: config.email.psw
  }
});
var mailOptions = {
  from: 'xxx@gmail.com',
  to: 'xxx@gmail.hu',
  subject: 'Test',
  text: 'req.query.text'
}

// eventlog
var eventLogStream = fs.createWriteStream(__dirname + '/event.log', {
  flags: 'a'
});
// app log
winston.add(winston.transports.File, {
  filename: __dirname + '/reg.log',
  handleExceptions: true
});

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('combined', {
  stream: eventLogStream
}));

app.route('/api/regisztraciok')
  .post(function(req, res) {
    winston.info('regisztracio in', req.body);
    // FIXME: egyediseg ellenőrzések, összefüggés ellenőrzések és validálás
    // FIXME: transzformációk, pl: Capitalize
    // FIXME: regisztrációs szám generálása
    dbReg.insert(req.body, function(err, newDoc) {
      winston.info('regisztracio out', newDoc);
      res.json(newDoc);
    });

  })
  .get(function(req, res) {
    // admin: minden reg letöltése
    if (req.query.key === config.adminKey) {
      dbReg.find({}, function(err, docs) {
        smtpTransport.sendMail(mailOptions, function(error, response) {
          if (error) {
            console.log(error);
            res.end("smtp error");
          } else {
            console.log("Message sent: " + response.message);
            res.send(docs);
          }
        });
      });
    } else {
      res.sendStatus(404);
    }
  });

app.listen(3000, function() {
  console.log('Listen on port 3000');
});
