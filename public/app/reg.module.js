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
      'v.reg.not.unique': 'Ezzel az email címmel már van regisztráció!',
      'v.app.error': 'Hiba történt a regisztráció mentésekor, próbáld meg újra!',
      'v.menu.limit': 'Sajnáljuk, de már nincs több hely a bankettre.'
    },
    'en': {
      'v.required': 'Check all required fields!',
      'v.name.error': 'Wrong name pattern.',
      'v.email.error': 'Wrong email address.',
      'v.dojo.error': 'Wrong Dojo name pattern.',
      'v.tel.error': 'Wrong phone number.',
      'v.ticket.error': 'Choose an apropiate ticket!',
      'v.agree.error': 'You must click on agreement!',
      'v.reg.not.unique': 'This email address already used to a registration.',
      'v.app.error': 'Application error, please try again!',
      'v.menu.limit': 'You can\'t booking to banquet, because we have exceeded the maximum limit.'
    }
  }
);

app.controller('RegistrationCtrl', ['$log', '$interval', '$translate', '$http', '$scope', 'RegistrationService', 'msg',
  function($log, $interval, $translate, $http, $scope, RegistrationService, msg) {

    $scope.showReg = true;

    var reg = this;

    // page variable
    reg.price = 0;
    reg.isMenuLimitExceeded = false;

    reg.changeLanguage = function(langKey) {
      $translate.use(langKey);
    };

    var checkMenuLimit = function() {
      RegistrationService.checkMenuLimit()
        .success(function(data, status, headers, config) {
          // menu limit isn't reached
          $log.log(data, status);
          reg.isMenuLimitExceeded = false;
        })
        .error(function(data, status, headers, config) {
          // menu limit exceeded
          $log.log(data, status);
          reg.msg = msg['hu'][data.errorCode];
          delete reg.menu;
          reg.isMenuLimitExceeded = true;
        });
    };
    //var refreshMenuLimit = $interval(checkMenuLimit, 5000);

    checkMenuLimit();

    reg.calcPrice = function() {
      RegistrationService.calcPrice(reg)
        .success(function(data, status, headers, config) {
          $log.log(data, status);
          reg.price = data.price;
        })
        .error(function(data, status, headers, config) {
          $log.log(data, status);
          reg.msg = msg['hu']['v.app.error'];
        });
    };

    reg.registration = function() {
      reg.msg = undefined;
      try {
        RegistrationService.validate(reg);
        // page variable remove
        delete reg.isMenuLimitExceeded;
        delete reg.price;

        RegistrationService.create(reg)
          .success(function(data, status, headers, config) {
            $log.log(data, status);
            $scope.showReg = false;
          })
          .error(function(data, status, headers, config) {
            $log.log(data, status);
            if (msg['hu'][data.errorCode]) {
              reg.msg = msg['hu'][data.errorCode] + ' [' + data.errorCode + ']';
            } else {
              reg.msg = msg['hu']['v.app.error'] + ' [' + data.errorCode + ']';
            }
            // limit check error
            if ('v.menu.limit' === data.errorCode) {
              reg.menu = undefined;
            }
          });

      } catch (e) {
        $log.log(e.message);
        reg.msg = msg['hu'][e.message];
      }
    }
  }
]);
