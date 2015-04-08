'use strict';

var app = angular.module('Reg', []);

app.controller('RegisztracioCtrl',
  function(RegisztracioService) {
    var reg = this;
    console.log('RegisztracioCtrl');

    reg.regisztracio = function() {
      console.log('Regisztracio nev: ', reg.nev);
      RegisztracioService.validate(reg);
    }
  }
);
