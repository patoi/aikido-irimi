// check blathy limit
'use strict';

var limitPromise = require('../promises/limit.promise');

module.exports = function(Q, winston, dbReg, regService, limit) {

  var Q = Q,
    winston = winston,
    limit = limit,
    dbReg = dbReg,
    regService = regService;

  var errorId = 'v.quarters.blathy.limit';

  var blathyLimitPromise = limitPromise(Q, winston, dbReg,
    limit, {
      'quarters': 'blathy'
    },
    errorId,
    function(reg) {
      return true;
    }
  );

  return function(req, res) {
    var reg = regService.transform(req.body);
    blathyLimitPromise(reg)
      .then(function() {
        res.status(200).end();
      })
      .catch(function(e) {
        winston.error(e.message);
        if (e.message == errorId) {
          res.status(406).json({
            'errorCode': errorId
          });
        } else {
          res.status(500).json({
            'errorCode': e.message
          });
        }
      }).done();
  }
};
