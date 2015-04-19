'use strict';

var regService = require('../reg.service.js');
var assert = require('chai').assert;

// FIXME: we need more test

var reg;
var deadlineDiscount;
beforeEach(function() {
  deadlineDiscount = false;
  reg = {
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
});

describe('getPrice in HUF', function() {
  context('registration is a full day workout and no deadline discounts', function() {
    it('should return 20000', function() {
      deadlineDiscount = false;
      reg.dojovezeto = false;
      reg.mkdeTag = false;
      reg.bankett = false;
      delete reg.etkezes;
      delete reg.szallas;
      assert.equal(regService.PRICES.huf.workout.teljes, regService.getPrice(reg, deadlineDiscount));
    });
  });
  context('registration is a full day workout and has discounts', function() {
    it('should return 20000', function() {
      deadlineDiscount = true;
      reg.dojovezeto = false;
      reg.mkdeTag = false;
      reg.bankett = false;
      delete reg.etkezes;
      delete reg.szallas;
      assert.equal(16000, regService.getPrice(reg, deadlineDiscount));
    });
  });
  context('registration is a full day workout and has discounts and dojovezeto', function() {
    it('should return 20000', function() {
      deadlineDiscount = true;
      reg.dojovezeto = true;
      reg.mkdeTag = false;
      reg.bankett = false;
      delete reg.etkezes;
      delete reg.szallas;
      assert.equal(12000, regService.getPrice(reg, deadlineDiscount));
    });
  });
  context('registration is a full day workout and has discounts and dojovezeto and mkdeTag', function() {
    it('should return 20000', function() {
      deadlineDiscount = true;
      reg.dojovezeto = true;
      reg.mkdeTag = true;
      reg.bankett = false;
      delete reg.etkezes;
      delete reg.szallas;
      assert.equal(10000, regService.getPrice(reg, deadlineDiscount));
    });
  });
  context('registration is a full day workout and has discounts and dojovezeto and mkdeTag and bankett', function() {
    it('should return 20000', function() {
      deadlineDiscount = true;
      reg.dojovezeto = true;
      reg.mkdeTag = true;
      reg.bankett = true;
      delete reg.etkezes;
      delete reg.szallas;
      assert.equal(18000, regService.getPrice(reg, deadlineDiscount));
    });
  });
  context('registration is a full day workout and has discounts and not dojovezeto and mkdeTag and bankett', function() {
    it('should return 20000', function() {
      deadlineDiscount = true;
      reg.dojovezeto = false;
      reg.mkdeTag = true;
      reg.bankett = true;
      delete reg.etkezes;
      delete reg.szallas;
      assert.equal(22000, regService.getPrice(reg, deadlineDiscount));
    });
  });
  context('registration is a full day workout and has discounts and not dojovezeto and not mkdeTag and bankett', function() {
    it('should return 20000', function() {
      deadlineDiscount = true;
      reg.dojovezeto = false;
      reg.mkdeTag = false;
      reg.bankett = true;
      delete reg.etkezes;
      delete reg.szallas;
      assert.equal(24000, regService.getPrice(reg, deadlineDiscount));
    });
  });
});
