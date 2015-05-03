// check menu limit
'use strict';

var menuLimitPromise = require('../menu.limit.promise');

module.exports = function(Q, winston, config, dbReg, regService) {

  var Q = Q,
    winston = winston,
    config = config,
    dbReg = dbReg,
    regService = regService;

  var menuLimit = menuLimitPromise(Q, winston, config, dbReg);

  return function(req, res) {
    var reg = regService.transform(req.body);
    menuLimit(reg)
      .then(function() {
        res.status(200).end();
      })
      .catch(function(e) {
        winston.error(e.message);
        if (e.message == 'v.menu.limit') {
          res.status(406).json({
            'errorCode': 'v.menu.limit'
          });
        } else {
          res.status(500).json({
            'errorCode': e.message
          });
        }
      }).done();
  }
};
