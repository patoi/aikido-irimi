'use strict';

var app = angular.module('Reg', []);

app.controller('RegisztracioCtrl',
  function(RegisztracioService) {
    var reg = this;
    reg.mkdeTag = '1';
    reg.penznem = 'huf';

    console.log('RegisztracioCtrl');

    reg.regisztracio = function() {
      console.log('Regisztracio: ', reg);
      RegisztracioService.validate(reg);
    }
  }
);
