'use strict';

describe('Regisztráció validálás', function() {

  var service;

  beforeEach(module('Reg'));

  beforeEach(inject(function(_RegisztracioService_) {
    service = _RegisztracioService_;
  }));

  var reg = {
    'nev': 'Teszt Elek',
    'email': 'tesztelek@gmail.com',
    'dojo': 'Aikido Dojo',
    'tel': '+36 12 345 6789',
    'mkdeTag': 1,
    'penznem': 'huf',
    'dojovezeto': true,
    'bankett': true,
    'edzesjegy': 'teljes',
    'szallas': '1agyas',
    'etkezes': {
      'reggeli': true,
      'ebed': true,
      'vacsora': true
    },
    'elfogadom': true
  };

  // required teszt
  it('kötelező mezők ellenőrzés hiba, nincs név: v.required', function() {
    var data = _.cloneDeep(reg);
    data.nev = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('kötelező mezők ellenőrzés hiba, nincs email: v.required', function() {
    var data = _.cloneDeep(reg);
    data.email = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('kötelező mezők ellenőrzés hiba, nincs dojo: v.required', function() {
    var data = _.cloneDeep(reg);
    data.dojo = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('kötelező mezők ellenőrzés hiba, nincs edzésjegy: v.required', function() {
    var data = _.cloneDeep(reg);
    data.edzesjegy = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('kötelező mezők ellenőrzés hiba, nincs elfogadom: v.required', function() {
    var data = _.cloneDeep(reg);
    data.elfogadom = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('kötelező mezők ellenőrzés hiba, nincs elfogadom és név: v.required', function() {
    var data = _.cloneDeep(reg);
    data.elfogadom = undefined;
    data.nev = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('kötelező mezők ellenőrzés hiba, név üres: v.required', function() {
    var data = _.cloneDeep(reg);
    data.nev = '     ';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  // név hossz teszt, max 100
  it('név hosszú ellenőrzés hiba: v.nev.hiba', function() {
    var data = _.cloneDeep(reg);
    data.nev = "AAAAABBBBBAAAAABBBBBAAAAABBBBBAAAAABBBBBAAAAABBBBBAAAAA BBBBBAAAAABBBBBAAAAABBBBBAAAAABBBBBAAAAABBBBBAAAAABBBBB";
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.nev.hiba');
    }
  });

  it('név rövid ellenőrzés hiba: v.nev.hiba', function() {
    var data = _.cloneDeep(reg);
    data.nev = "A A";
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.nev.hiba');
    }
  });

  it('név hossz ellenőrzés sikeres', function() {
    var data = _.cloneDeep(reg);
    expect(service.validate(data)).toBe(true);
  });

  // típus teszt
  it('név típus ellenőrzés hiba', function() {
    var data = _.cloneDeep(reg);
    data.nev = '123 123';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.nev.hiba');
    }
  });

  it('email típus ellenőrzés hiba', function() {
    var data = _.cloneDeep(reg);
    data.email = 'rossz';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.email.hiba');
    }
  });

  it('email típus ellenőrzés sikeres', function() {
    var data = _.cloneDeep(reg);
    data.email = 'v@v.hu';
    expect(service.validate(data)).toBe(true);
  });


  it('dojo típus ellenőrzés hiba', function() {
    var data = _.cloneDeep(reg);
    data.dojo = '123 123';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.dojo.hiba');
    }
  });

  it('pénznem típus ellenőrzés hiba', function() {
    var data = _.cloneDeep(reg);
    data.penznem = 'xxx';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.penznem.hiba');
    }
  });

  it('pénznem típus ellenőrzés sikeres', function() {
    var data = _.cloneDeep(reg);
    data.penznem = 'huf';
    expect(service.validate(data)).toBe(true);
  });

  it('edzésjegy típus ellenőrzés hiba', function() {
    var data = _.cloneDeep(reg);
    data.edzesjegy = 'xxx';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.edzesjegy.hiba');
    }
  });

  it('edzésjegy típus ellenőrzés sikeres', function() {
    var data = _.cloneDeep(reg);
    data.edzesjegy = '1napi';
    expect(service.validate(data)).toBe(true);
  });

  it('szállás típus ellenőrzés hiba', function() {
    var data = _.cloneDeep(reg);
    data.szallas = '10agyas';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.szallas.hiba');
    }
  });

  it('szállás típus ellenőrzés sikeres', function() {
    var data = _.cloneDeep(reg);
    data.szallas = '1agyas';
    expect(service.validate(data)).toBe(true);
  });

  it('szállás típus ellenőrzés sikeres, mert opcionális', function() {
    var data = _.cloneDeep(reg);
    data.szallas = undefined;
    expect(service.validate(data)).toBe(true);
  });

  it('elfogadom ellenőrzés hiba, mert false az értéke', function() {
    var data = _.cloneDeep(reg);
    data.elfogadom = false;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.elfogadom.hiba');
    }
  });

  it('elfogadom ellenőrzése: mindig true-nak kell lennie', function() {
    var data = _.cloneDeep(reg);
    data.elfogadom = true;
    expect(service.validate(data)).toBe(true);
  });


});
