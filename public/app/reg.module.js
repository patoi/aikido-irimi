'use strict';

var app = angular.module('Reg', ['pascalprecht.translate', 'ngCookies']);

app.constant(
  'msg', {
    'hu': {
      'v.required': 'Ellenőrizd, hogy minden kötelező mezőt megadtál-e!',
      'v.nev.hiba': 'Hibás név.',
      'v.email.hiba': 'Hibás email.',
      'v.dojo.hiba': 'Hibás a dojo neve.',
      'v.tel.hiba': 'Hibás telefonszám.',
      'v.penznem.hiba': 'Hibás a pénznem kiválasztás.',
      'v.edzesjegy.hiba': 'Nem megfelelő az edzésjegy.',
      'v.szallas.hiba': 'Nem megfelelő a szállás.',
      'v.elfogadom.hiba': 'El kell fogadni a feltételeket!'
    }
  }
);

app.controller('RegisztracioCtrl', ['$translate', '$http', '$scope', 'RegisztracioService', 'msg',
  function($translate, $http, $scope, RegisztracioService, msg) {

    $scope.showReg = true;

    var reg = this;
    reg.mkdeTag = '1';
    reg.penznem = 'huf';

    reg.changeLanguage = function(langKey) {
      $translate.use(langKey);
    };

    reg.regisztracio = function() {
      reg.hiba = undefined;
      try {
        if (!reg.szallas && reg.etkezes) {
          delete reg.etkezes;
        }
        RegisztracioService.validate(reg);
        RegisztracioService.create(reg)
          .success(function(data, status, headers, config) {
            console.log(data, status);
            $scope.showReg = false;
          })
          .error(function(data, status, headers, config) {
            console.log(data, status);
            if (status === 409) {
              reg.hiba = 'Ezzel az email címmel már van regisztráció! [' + data.errorCode + ']';
            } else {
              reg.hiba = 'Hiba történt a regisztráció mentésekor, próbáld meg újra! [' + data.errorCode + ']';
            }
          });

      } catch (e) {
        console.log(e.message);
        reg.hiba = msg['hu'][e.message];
      }
    }
  }
]);
