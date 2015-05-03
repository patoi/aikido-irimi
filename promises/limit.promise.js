// check limit promise
'use strict';

/**
 * Check limit.
 * @param <Q>
 * @param <Winston>
 * @param <Nedb>
 * @param <Number> limit
 * @param <Object> query object
 * @param <String> errorId
 * @param <Function> if return true, then limit validation must run
 * @return <Promise> resolve reg object
 */
module.exports = function(Q, winston, dbReg, limit, query, errorId, needValidationFunc) {

  var Q = Q,
    winston = winston,
    dbReg = dbReg,
    limit = limit,
    query = query,
    errorId = errorId;

  // check quarters limit
  return function(reg) {
    var deferred = Q.defer();
    dbReg.count(query, function(err, count) {
      if (err) {
        winston.error(err);
        return deferred.reject(err);

      } else {
        if (count >= limit) {
          // limits has been reached
          if (needValidationFunc(reg)) {
            // error: limit reached
            winston.info('limit exceeded: ' + errorId);
            return deferred.reject(new Error(errorId));
          } else {
            // no error: user is not booking to quarters
            return deferred.resolve(reg);
          }

        } else {
          return deferred.resolve(reg);
        }
      };
    });
    return deferred.promise;
  };
};
