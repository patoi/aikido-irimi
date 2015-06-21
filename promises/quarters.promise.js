// count quarters
'use strict';

/**
 * Count number of rooms booked.
 * Calling object:
  var result = {
   'javorka': {
     'd0': 0,
     'd1': 0,
     'd2': 0,
     'd3': 0
   },
   'blathy': {
     'd0': 0,
     'd1': 0,
     'd2': 0,
     'd3': 0
   }
 };
 * @param <Q>
 * @param <Winston>
 * @param <Nedb>
 * @return <Promise> resolve reg object
 */
module.exports = function(Q, winston, dbReg) {

  var Q = Q,
    winston = winston,
    dbReg = dbReg;

  var countDormDay = function(query, result, day) {
    var deferred = Q.defer();
    dbReg.count(query, function(err, count) {
      if (err) {
        winston.error(err);
        return deferred.reject(err);
      } else {
        result[query.quarters][day] = count;
        return deferred.resolve(result);
      };
    });
    return deferred.promise;
  };

  var countJavorkaD0 = function(result) {
    return countDormDay({
      'quarters': 'javorka',
      'd0': true
    }, result, 'd0');
  };

  var countJavorkaD1 = function(result) {
    return countDormDay({
      'quarters': 'javorka',
      'd1': true
    }, result, 'd1');
  };

  var countJavorkaD2 = function(result) {
    return countDormDay({
      'quarters': 'javorka',
      'd2': true
    }, result, 'd2');
  };

  var countJavorkaD3 = function(result) {
    return countDormDay({
      'quarters': 'javorka',
      'd3': true
    }, result, 'd3');
  };

  var countBlathyD0 = function(result) {
    return countDormDay({
      'quarters': 'blathy',
      'd0': true
    }, result, 'd0');
  };

  var countBlathyD1 = function(result) {
    return countDormDay({
      'quarters': 'blathy',
      'd1': true
    }, result, 'd1');
  };

  var countBlathyD2 = function(result) {
    return countDormDay({
      'quarters': 'blathy',
      'd2': true
    }, result, 'd2');
  };

  var countBlathyD3 = function(result) {
    return countDormDay({
      'quarters': 'blathy',
      'd3': true
    }, result, 'd3');
  };

  return function(result) {
    return countJavorkaD0(result)
      .then(countJavorkaD1)
      .then(countJavorkaD2)
      .then(countJavorkaD3)
      .then(countBlathyD0)
      .then(countBlathyD1)
      .then(countBlathyD2)
      .then(countBlathyD3);
  };
};
