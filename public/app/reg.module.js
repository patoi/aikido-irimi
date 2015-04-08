'use strict';

var app = angular.module('Reg', []);

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

app.controller('RegisztracioCtrl',
  function(RegisztracioService, msg) {
    var reg = this;
    reg.mkdeTag = '1';
    reg.penznem = 'huf';

    console.log('RegisztracioCtrl');

    reg.regisztracio = function() {
      console.log('Regisztracio: ', reg);
      reg.hiba = undefined;
      try {
        RegisztracioService.validate(reg);
      } catch (e) {
        console.log(e.message);
        reg.hiba = msg['hu'][e.message];
      }
    }
  }
);
