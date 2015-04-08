'use strict';

app.factory('RegisztracioService', [
  '$http',
  '$window',
  function($http, $window) {

    var create = function(reg) {
      $http.post('/api/regisztracio', reg)
      .success(function(data, status, headers, config) {
        console.log(data, status);
      }).
      error(function(data, status, headers, config) {
        console.log(data, status);
      });
    };

    var validate = function(reg) {
      var required =
        _.trim(reg.nev) &&
        _.trim(reg.email) &&
        _.trim(reg.dojo) &&
        _.trim(reg.tel) &&
        _.trim(reg.penznem) &&
        _.trim(reg.edzesjegy) &&
        reg.elfogadom;

      if (!required) {
        throw new Error('v.required');
      } else {}

      var nevRegEx = /^([a-zöüóőúéáűíä \-\.]){6,100}$/gi;
      var dojoNevRegEx = /^([a-zöüóőúéáűíä \-\.]){6,100}$/gi;
      var telRegEx = /^([0-9 \-\+]){7,16}$/gi;

      if (!nevRegEx.test(reg.nev)) {
        throw new Error('v.nev.hiba');
      }
      if (!is.email(reg.email)) {
        throw new Error('v.email.hiba');
      }
      if (!dojoNevRegEx.test(reg.dojo)) {
        throw new Error('v.dojo.hiba');
      }
      if (!telRegEx.test(reg.tel)) {
        throw new Error('v.tel.hiba');
      }
      if (reg.penznem !== 'huf' && reg.penznem !== 'euro') {
        throw new Error('v.penznem.hiba');
      }
      if (reg.edzesjegy !== 'teljes' &&
        reg.edzesjegy !== '1napi' &&
        reg.edzesjegy !== '2napi' &&
        reg.edzesjegy !== '3napi' &&
        reg.edzesjegy !== '4napi' &&
        reg.edzesjegy !== '1edzes' &&
        reg.edzesjegy !== '2edzes' &&
        reg.edzesjegy !== '3edzes' &&
        reg.edzesjegy !== '4edzes' &&
        reg.edzesjegy !== '5edzes' &&
        reg.edzesjegy !== '6edzes' &&
        reg.edzesjegy !== '7edzes') {
        throw new Error('v.edzesjegy.hiba');
      }
      if (reg.szallas &&
        reg.szallas !== '2agyas' &&
        reg.szallas !== '1agyas') {
        throw new Error('v.szallas.hiba');
      }
      if (reg.elfogadom !== true) {
        throw new Error('v.elfogadom.hiba');
      }
      return true;
    };

    return {
      create: create,
      validate: validate
    };
  }
]);
