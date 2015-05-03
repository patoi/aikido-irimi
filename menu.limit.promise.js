// check menu limit promise
'use strict';

module.exports = function(Q, winston, config, dbReg) {

  var Q = Q,
    winston = winston,
    config = config,
    dbReg = dbReg;

  // check menu limit
  return function(reg) {
    var deferred = Q.defer();
    dbReg.count({
      $where: function() {
        return this.menu !== undefined;
      }
    }, function(err, count) {
      if (err) {
        winston.error(err);
        return deferred.reject(err);

      } else {
        if (count >= config.menuLimit) {
          winston.info('menu limit exceeded');
          // menuLimit has been reached
          return deferred.reject(new Error('v.menu.limit'));

        } else {
          return deferred.resolve(reg);
        }
      };
    });
    return deferred.promise;
  };
};
