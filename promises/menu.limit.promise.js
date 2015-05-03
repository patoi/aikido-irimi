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
          // !reg.name check the first call
          if (reg.menu || !reg.name) {
            // error: limit reached
            return deferred.reject(new Error('v.menu.limit'));
          } else {
            // no error: user is not booking to banquet
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
