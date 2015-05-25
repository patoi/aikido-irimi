'use strict';

var app = angular.module('Reg', ['pascalprecht.translate', 'ngCookies']);

app.constant(
  'msg', {
    'hu': {
      'v.quarters.required': 'Válassz legalább egy napot a szálláshoz!',
      'v.required': 'Ellenőrizd, hogy minden kötelező mezőt megadtál-e!',
      'v.name.error': 'Hibás név.',
      'v.email.error': 'Hibás email.',
      'v.dojo.error': 'Hibás a dojo neve.',
      'v.tel.error': 'Hibás telefonszám.',
      'v.ticket.error': 'Nem megfelelő az edzésjegy.',
      'v.agree.error': 'El kell fogadni a feltételeket!',
      'v.reg.not.unique': 'Ezzel az email címmel már van regisztráció!',
      'v.app.error': 'Hiba történt a regisztráció mentésekor, próbáld meg újra!',
      'v.menu.limit': 'Sajnáljuk, de már nincs több hely a bankettre.',
      'v.quarters.full': 'Nincs már szabad szoba.'
    },
    'en': {
      'v.quarters.required': 'Choose at least one day for quarters!',
      'v.required': 'Check all required fields!',
      'v.name.error': 'Wrong name pattern.',
      'v.email.error': 'Wrong email address.',
      'v.dojo.error': 'Wrong Dojo name pattern.',
      'v.tel.error': 'Wrong phone number.',
      'v.ticket.error': 'Choose an apropiate ticket!',
      'v.agree.error': 'You must click on agreement!',
      'v.reg.not.unique': 'This email address already used to a registration.',
      'v.app.error': 'Application error, please try again!',
      'v.menu.limit': 'You can\'t booking to banquet, because we have exceeded the maximum limit.',
      'v.quarters.full': 'There is no free room.'
    }
  }
);

app.controller('RegistrationCtrl', ['$window', '$log', '$interval', '$translate', '$http', '$scope', 'RegistrationService', 'msg',
  function($window, $log, $interval, $translate, $http, $scope, RegistrationService, msg) {

    $scope.showReg = true;
    $scope.disableRegButton = false;
    $scope.javorkaIsFull = false;
    $scope.blathyIsFull = false;

    var reg = this;
    reg.lang = $window.localStorage.getItem('NG_TRANSLATE_LANG_KEY') || 'hu';
    reg.d1 = false;
    reg.d2 = false;
    reg.d3 = false;

    // page variable
    reg.price = 0;
    reg.isMenuLimitExceeded = false;

    reg.changeLanguage = function(langKey) {
      reg.lang = langKey;
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

      RegistrationService.checkQuarters()
        .success(function(data, status, headers, config) {
          $log.log(data, status);
          $scope.freeRooms = data;

          if (data.javorka.d1 === 0 && data.javorka.d2 === 0 && data.javorka.d3 === 0) {
            // javorka is full
            $scope.javorkaIsFull = true;
            delete reg.quarters;
          }

          if (data.blathy.d1 === 0 && data.blathy.d2 === 0 && data.blathy.d3 === 0) {
            // blathy is full
            $scope.blathyIsFull = true;
            delete reg.quarters;
          }
        })
        .error(function(data, status, headers, config) {
          $log.log(data, status);
          delete reg.quarters;
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
          reg.msg = msg[reg.lang]['v.app.error'];
        });
    };

    reg.resetDay = function() {
      reg.d1 = false;
      reg.d2 = false;
      reg.d3 = false;
      reg.calcPrice();

    }

    reg.registration = function() {
      // need at least one day if user choose a quarters
      if (reg.quarters && !reg.d1 && !reg.d2 && !reg.d3) {
        console.log(reg.lang);
        reg.msg = msg[reg.lang]['v.quarters.required'];
        return false;
      }
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
            if (msg[reg.lang][data.errorCode]) {
              reg.msg = msg[reg.lang][data.errorCode] + ' [' + data.errorCode + ']';
            } else {
              reg.msg = msg[reg.lang]['v.app.error'] + ' [' + data.errorCode + ']';
            }
            // limit check error
            if ('v.menu.limit' === data.errorCode) {
              reg.menu = undefined;
            }
            $scope.disableRegButton = false;
          });

      } catch (e) {
        $log.log(e.message);
        reg.msg = msg[reg.lang][e.message];
        $scope.disableRegButton = false;
      }
    }
  }
]);
