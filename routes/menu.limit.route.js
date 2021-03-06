// check menu limit
'use strict';

var limitPromise = require('../promises/limit.promise');

module.exports = function(Q, winston, config, dbReg, regService) {

  var Q = Q,
    winston = winston,
    config = config,
    dbReg = dbReg,
    regService = regService;

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

  return function(req, res) {
    var reg = regService.transform(req.body);
    menuLimitPromise(reg)
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
