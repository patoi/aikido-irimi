// regService.getPrice unit test
'use strict';

var regService = require('../reg.service.js');
var assert = require('chai').assert;

var prices = regService.PRICES.huf;

var reg;

beforeEach(function() {
  reg = {
    'nev': 'Teszt Elek',
    'email': 'tesztelek@gmail.com',
    'dojo': 'Aikido Dojo',
    'tel': '+36 12 345 6789',
    'mkdeTag': true,
    'dojoleader': true,
    'menu': 'menu_A',
    'ticket': 'whole',
    'quarters': 'javorka',
    'd1': true,
    'd2': true,
    'd3': true,
    'agree': true
  };
});

describe('getPrice in HUF', function() {

  context('registration is a full day workout and not member of the MKDE', function() {
    it('should return ' + prices.nonMkdeTag.whole, function() {
      reg.mkdeTag = false;
      delete reg.menu;
      delete reg.quarters;
      assert.equal(prices.nonMkdeTag.whole, regService.getPrice(reg));
    });
  });

  context('registration is a full day workout and member of the MKDE', function() {
    it('should return ' + prices.mkdeTag.whole, function() {
      delete reg.menu;
      delete reg.quarters;
      assert.equal(prices.mkdeTag.whole, regService.getPrice(reg));
    });
  });

  context('registration is a 1 day workout and member of the MKDE', function() {
    it('should return ' + prices.mkdeTag['1day'], function() {
      delete reg.menu;
      delete reg.quarters;
      reg.ticket = '1day';
      assert.equal(prices.mkdeTag['1day'], regService.getPrice(reg));
    });
  });

  context('registration is a 1 keiko and member of the MKDE', function() {
    it('should return ' + prices.mkdeTag['1keiko'], function() {
      delete reg.menu;
      delete reg.quarters;
      reg.ticket = '1keiko';
      assert.equal(prices.mkdeTag['1keiko'], regService.getPrice(reg));
    });
  });

  context('registration is a full day workout and has a menu A and MKDE member', function() {
    var expected = prices.mkdeTag.whole + prices.menu.menu_A;
    it('should return '  + expected, function() {
      reg.menu = 'menu_A';
      delete reg.quarters;

      assert.equal(expected, regService.getPrice(reg));
    });
  });

  context('registration is a full day workout and has a menu F and MKDE member', function() {
    var expected = prices.mkdeTag.whole + prices.menu.menu_F;
    it('should return '  + expected, function() {
      reg.menu = 'menu_F';
      delete reg.quarters;

      assert.equal(expected, regService.getPrice(reg));
    });
  });

  context('registration is a full day workout and has a menu F and MKDE member and has a javorka quarters', function() {
    var expected = prices.mkdeTag.whole + prices.menu.menu_F + 3 * prices.quarters.javorka;
    it('should return '  + expected, function() {
      reg.menu = 'menu_F';
      reg.quarters = 'javorka';
      assert.equal(expected, regService.getPrice(reg));
    });
  });

  context('registration is a full day workout and has a menu F and MKDE member and has a blathy quarters', function() {
    var expected = prices.mkdeTag.whole + prices.menu.menu_F + 3 * prices.quarters.blathy;
    it('should return '  + expected, function() {
      reg.menu = 'menu_F';
      reg.quarters = 'blathy';

      assert.equal(expected, regService.getPrice(reg));
    });
  });

  context('registration is a full day workout and has a menu F and MKDE member and has a blathy quarters', function() {
    var javorka = prices.mkdeTag.whole + prices.menu.menu_F + 3 * prices.quarters.javorka;
    var blathy = prices.mkdeTag.whole + prices.menu.menu_F + 3 * prices.quarters.blathy;
    it('should not equals a javorka quarters', function() {
      reg.menu = 'menu_F';
      reg.quarters = 'javorka';
      var javorka = regService.getPrice(reg);
      reg.quarters = 'blathy';
      var blathy = regService.getPrice(reg);

      assert.notEqual(javorka, blathy);
    });
  });

});
