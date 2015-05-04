// registration validation on client
'use strict';

describe('Validate a registration', function() {

  var service;

  beforeEach(module('Reg'));

  beforeEach(inject(function(_RegistrationService_) {
    service = _RegistrationService_;
  }));

  var reg = {
    'name': 'Teszt Elek',
    'email': 'tesztelek@gmail.com',
    'dojo': 'Aikido Dojo',
    'tel': '+36 12 345 6789',
    'mkdeTag': true,
    'dojoleader': true,
    'ticket': 'whole',
    'quarters': 'javorka',
    'agree': true
  };

  // required
  it('name required: v.required', function() {
    var data = _.cloneDeep(reg);
    data.name = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('email required: v.required', function() {
    var data = _.cloneDeep(reg);
    data.email = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('dojo required: v.required', function() {
    var data = _.cloneDeep(reg);
    data.dojo = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('ticket required: v.required', function() {
    var data = _.cloneDeep(reg);
    data.ticket = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('agree required: v.required', function() {
    var data = _.cloneDeep(reg);
    data.agree = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('agree and name required: v.required', function() {
    var data = _.cloneDeep(reg);
    data.agree = undefined;
    data.name = undefined;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('empty name not allowed: v.required', function() {
    var data = _.cloneDeep(reg);
    data.name = '     ';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('too long name: v.name.error', function() {
    var data = _.cloneDeep(reg);
    data.name = "AAAAABBBBBAAAAABBBBBAAAAABBBBBAAAAABBBBBAAAAABBBBBAAAAA BBBBBAAAAABBBBBAAAAABBBBBAAAAABBBBBAAAAABBBBBAAAAABBBBB";
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.name.error');
    }
  });

  it('too short name: v.name.error', function() {
    var data = _.cloneDeep(reg);
    data.name = "A A";
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.name.error');
    }
  });

  it('name contains number', function() {
    var data = _.cloneDeep(reg);
    data.name = '123 123';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.name.error');
    }
  });

  it('email validation failed', function() {
    var data = _.cloneDeep(reg);
    data.email = 'notavalidemail';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.email.error');
    }
  });

  it('email validation success', function() {
    var data = _.cloneDeep(reg);
    data.email = 'v@v.hu';
    expect(service.validate(data)).toBe(true);
  });


  it('dojo contains number', function() {
    var data = _.cloneDeep(reg);
    data.dojo = '123 123';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.dojo.error');
    }
  });

  it('invalid ticket type', function() {
    var data = _.cloneDeep(reg);
    data.ticket = 'xxx';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.ticket.error');
    }
  });

  it('ticket type valid', function() {
    var data = _.cloneDeep(reg);
    data.ticket = '1day';
    expect(service.validate(data)).toBe(true);
  });

  it('quarters type invalid', function() {
    var data = _.cloneDeep(reg);
    data.quarters = 'notavalidquarters';
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.quarters.error');
    }
  });

  it('quarters type valid', function() {
    var data = _.cloneDeep(reg);
    data.szallas = 'javorka';
    expect(service.validate(data)).toBe(true);
  });

  it('quarters is optional', function() {
    var data = _.cloneDeep(reg);
    data.quarters = undefined;
    expect(service.validate(data)).toBe(true);
  });

  it('must agree', function() {
    var data = _.cloneDeep(reg);
    data.agree = false;
    try {
      expect(service.validate(data)).toThrow();
    } catch (e) {
      expect(e.message).toBe('v.required');
    }
  });

  it('agree valid', function() {
    var data = _.cloneDeep(reg);
    data.agree = true;
    expect(service.validate(data)).toBe(true);
  });


});
