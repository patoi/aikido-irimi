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
    $scope.disableRegButton = false;

    var reg = this;

    // page variable
    reg.price = 0;
    reg.isMenuLimitExceeded = false;
    reg.isJavorkaLimitExceeded = false;
    reg.isBlathyLimitExceeded = false;

    reg.changeLanguage = function(langKey) {
      $translate.use(langKey);
    };

    var checkLimits = function() {
      RegistrationService.checkMenuLimit()
        .success(function(data, status, headers, config) {
          // menu limit isn't reached
          $log.log(data, status);
          reg.isMenuLimitExceeded = false;
        })
        .error(function(data, status, headers, config) {
          // menu limit exceeded
          $log.log(data, status);
          delete reg.menu;
          reg.isMenuLimitExceeded = true;
        });
      RegistrationService.checkJavorkaLimit()
        .success(function(data, status, headers, config) {
          // javorka limit isn't reached
          $log.log(data, status);
          reg.isJavorkaLimitExceeded = false;
        })
        .error(function(data, status, headers, config) {
          // javorka limit exceeded
          $log.log(data, status);
          if (reg.quarters && reg.quarters === 'javorka') {
            delete reg.quarters;
          }
          reg.isJavorkaLimitExceeded = true;
        });
      RegistrationService.checkBlathyLimit()
        .success(function(data, status, headers, config) {
          // blathy limit isn't reached
          $log.log(data, status);
          reg.isBlathyLimitExceeded = false;
        })
        .error(function(data, status, headers, config) {
          // Blathy limit exceeded
          $log.log(data, status);
          if (reg.quarters && reg.quarters === 'blathy') {
            delete reg.quarters;
          }
          reg.isBlathyLimitExceeded = true;
        });
    };
    //var refreshMenuLimit = $interval(checkMenuLimit, 5000);

    checkLimits();

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
      $scope.disableRegButton = true;
      try {
        RegistrationService.validate(reg);
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
            $scope.disableRegButton = false;
          });

      } catch (e) {
        $log.log(e.message);
        reg.msg = msg['hu'][e.message];
        $scope.disableRegButton = false;
      }
    }
  }
]);
