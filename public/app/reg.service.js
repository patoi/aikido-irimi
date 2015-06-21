'use strict';

app.factory('RegistrationService', [
  '$http',
  '$window',
  function($http, $window) {

    var create = function(reg) {
      return $http.post('/api/registrations', reg);
    };

    var calcPrice = function(reg) {
      return $http.post('/api/price', reg);
    };

    var checkMenuLimit = function() {
      return $http.get('/api/limits/menu');
    };
    var checkQuarters = function() {
      return $http.get('/api/limits/quarters');
    };

    var validate = function(reg) {
      var required =
        _.trim(reg.name) &&
        _.trim(reg.email) &&
        _.trim(reg.dojo) &&
        _.trim(reg.tel) &&
        _.trim(reg.ticket) &&
        reg.agree;

      if (!required) {
        throw new Error('v.required');
      } else {}

      var nameRegex = /^([a-zöüóőúéáűíä \-\.]){6,100}$/gi;
      var dojonameRegex = /^([a-zöüóőúéáűíä\ \-\.\']){2,100}$/gi;
      var telRegEx = /^([0-9 \-\+]){7,16}$/gi;

      if (!nameRegex.test(reg.name)) {
        throw new Error('v.name.error');
      }
      if (!is.email(reg.email)) {
        throw new Error('v.email.error');
      }
      if (!dojonameRegex.test(reg.dojo)) {
        throw new Error('v.dojo.error');
      }
      if (!telRegEx.test(reg.tel)) {
        throw new Error('v.tel.error');
      }
      if (reg.ticket !== 'whole' &&
        reg.ticket !== '1day' &&
        reg.ticket !== '2day' &&
        reg.ticket !== '3day' &&
        reg.ticket !== '4day' &&
        reg.ticket !== '1keiko' &&
        reg.ticket !== '2keiko' &&
        reg.ticket !== '3keiko' &&
        reg.ticket !== '4keiko' &&
        reg.ticket !== '5keiko' &&
        reg.ticket !== '6keiko' &&
        reg.ticket !== '7keiko') {
        throw new Error('v.ticket.error');
      }
      if (reg.tshirt) {
        for (var property in reg.tshirt) {
          if (reg.tshirt.hasOwnProperty(property) && reg.tshirt[property]) {
            if (reg.tshirt[property] < 0 || reg.tshirt[property] > 5) {
              // invalid value
              throw new Error('v.tshirt.error');
            }
          }
        }
      }
      if (reg.quarters) {
        if (reg.quarters !== 'javorka' &&
          reg.quarters !== 'blathy') {
          throw new Error('v.quarters.error');
        }
        if (!reg.d0 && !reg.d1 && !reg.d2 && !reg.d3) {
          throw new Error('v.quarters.required');
        }
      }
      if (reg.agree !== true) {
        throw new Error('v.agree.error');
      }
      return true;
    };

    return {
      create: create,
      validate: validate,
      calcPrice: calcPrice,
      checkMenuLimit: checkMenuLimit,
      checkQuarters: checkQuarters
    };
  }
]);
