// check javorka limit
'use strict';

var limitPromise = require('../promises/limit.promise');

module.exports = function(Q, winston, dbReg, regService, limit) {

  var Q = Q,
    winston = winston,
    limit = limit,
    dbReg = dbReg,
    regService = regService;

  var errorId = 'v.quarters.javorka.limit';

  var javorkaLimitPromise = limitPromise(Q, winston, dbReg,
    limit, {
      'quarters': 'javorka'
    },
    errorId,
    function(reg) {
      return true;
    }
  );

  return function(req, res) {
    var reg = regService.transform(req.body);
    javorkaLimitPromise(reg)
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
