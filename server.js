// aikido camp registration app
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs')
var Q = require('q');

var morgan = require('morgan');
var winston = require('winston');

var aws = require('aws-sdk');
var Datastore = require('nedb');

// app deps
var config = require('./config/config.' + process.env.NODE_ENV);
var regService = require('./reg.service.js');

// init SMTP
aws.config.loadFromPath('./config/config.aws.json');
var ses = new aws.SES({
  apiVersion: '2010-12-01'
});

// init database
var dbReg = new Datastore({
  filename: __dirname + '/reg.db',
  autoload: true
});

// app log
winston.add(winston.transports.File, {
  filename: __dirname + '/reg.log',
  handleExceptions: true
});

// routes
var priceRoute = require('./routes/price.route.js')
  (winston, regService);
var regRoute = require('./routes/registration.route.js')
  (Q, winston, config, ses, dbReg, regService);
var menuLimitRoute = require('./routes/menu.limit.route.js')
  (Q, winston, config, dbReg, regService);
var javorkaLimitRoute = require('./routes/javorka.limit.route.js')
  (Q, winston, dbReg, regService, config.quarters.javorkaLimit);
var blathyLimitRoute = require('./routes/blathy.limit.route.js')
  (Q, winston, dbReg, regService, config.quarters.blathyLimit);

// middleware config
app.use(bodyParser.json());
// public web
app.use(express.static('public'));
// event log init
var eventLogStream = fs.createWriteStream(__dirname + '/event.log', {
  flags: 'a'
});
app.use(morgan('combined', {
  stream: eventLogStream
}));

// routes
app.route('/api/price')
  .post(priceRoute);
app.route('/api/limits/menu')
  .get(menuLimitRoute);
app.route('/api/limits/javorka')
  .get(javorkaLimitRoute);
app.route('/api/limits/blathy')
  .get(blathyLimitRoute);
app.route('/api/registrations')
  .post(regRoute.registration)
  .get(regRoute.readAll);

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
process.on('SIGTERM', function() {
  winston.info("Shutdown reg application...");
  server.close();
});
