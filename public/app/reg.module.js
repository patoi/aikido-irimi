'use strict';

var app = angular.module('Reg', ['pascalprecht.translate', 'ngCookies']);

app.constant(
  'msg', {
    'hu': {
      'v.required': 'Ellenőrizd, hogy minden kötelező mezőt megadtál-e!',
      'v.name.error': 'Hibás név.',
      'v.email.error': 'Hibás email.',
      'v.dojo.error': 'Hibás a dojo neve.',
      'v.tel.error': 'Hibás telefonszám.',
      'v.ticket.error': 'Nem megfelelő az edzésjegy.',
      'v.agree.error': 'El kell fogadni a feltételeket!',
      'v.email.unique.error': 'Ezzel az email címmel már van regisztráció!',
      'v.app.error': 'Hiba történt a regisztráció mentésekor, próbáld meg újra!'
    },
    'en': {
      'v.required': 'Check all required fields!',
      'v.name.error': 'Wrong name pattern.',
      'v.email.error': 'Wrong email address.',
      'v.dojo.error': 'Wrong Dojo name pattern.',
      'v.tel.error': 'Wrong phone number.',
      'v.ticket.error': 'Choose an apropiate ticket!',
      'v.agree.error': 'You must click on agreement!',
      'v.email.unique.error': 'This email address already used to a registration.',
      'v.app.error': 'Application error, please try again!'
    }
  }
);

app.controller('RegistrationCtrl', ['$translate', '$http', '$scope', 'RegistrationService', 'msg',
  function($translate, $http, $scope, RegistrationService, msg) {

    $scope.showReg = true;

    var reg = this;

    reg.price = 0;

    reg.changeLanguage = function(langKey) {
      $translate.use(langKey);
    };

    reg.calcPrice = function() {
      RegistrationService.calcPrice(reg)
        .success(function(data, status, headers, config) {
          console.log(data, status);
          reg.price = data.price;
        })
        .error(function(data, status, headers, config) {
          console.log(data, status);
          reg.msg = msg['hu']['v.app.error'] + '[' + data.errorCode + ']';
        });
    };

    reg.registration = function() {
      reg.msg = undefined;
      try {
        RegistrationService.validate(reg);
        RegistrationService.create(reg)
          .success(function(data, status, headers, config) {
            console.log(data, status);
            $scope.showReg = false;
          })
          .error(function(data, status, headers, config) {
            console.log(data, status);
            if (status === 409) {
              reg.msg = msg['hu']['v.email.unique.error'] + '[' + data.errorCode + ']';
            } else {
              reg.msg = msg['hu']['v.app.error'] + '[' + data.errorCode + ']';
            }
          });

      } catch (e) {
        console.log(e.message);
        reg.msg = msg['hu'][e.message];
      }
    }
  }
]);
