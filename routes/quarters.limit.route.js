// return number of rooms booked in json
'use strict';

var quartersCount = require('../promises/quarters.promise');

module.exports = function(Q, winston, dbReg, javorkaLimit, blathyLimit) {

  var Q = Q,
    winston = winston,
    dbReg = dbReg,
    regService = regService,
    javorkaLimit = javorkaLimit,
    blathyLimit = blathyLimit;

  // DI quarters accomodation counter
  var quartersCountObj = quartersCount(Q, winston, dbReg);

  return function(req, res) {
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
      .then(function(result, err) {
        var freeRooms = {
          'javorka': {
            'd1': javorkaLimit - result.javorka.d1,
            'd2': javorkaLimit - result.javorka.d2,
            'd3': javorkaLimit - result.javorka.d3
          },
          'blathy': {
            'd1': blathyLimit - result.blathy.d1,
            'd2': blathyLimit - result.blathy.d2,
            'd3': blathyLimit - result.blathy.d3
          }
        };
        res.status(200).json(
          freeRooms
        );
      })
      .catch(function(e) {
        winston.error(e.message);
        res.status(500).json({
          'errorCode': e.message
        });
      }).done();
  }
};
