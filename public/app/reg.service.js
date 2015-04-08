'use strict';

app.factory('RegisztracioService', [
  '$http',
  '$window',
  function($http, $window) {

    var create = function(reg) {

    };

    var validate = function(reg) {
      console.log('Validated reg, ' + reg.nev);
    };

    return {
      create: create,
      validate: validate
    };
  }
]);
