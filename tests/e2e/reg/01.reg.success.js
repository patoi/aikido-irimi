/**
 * Reg. success
 */
'use strict';

var config = require('../../../config/config.ci.js');

var url = 'http://' + config.ip + ':' + config.port;

module.exports = {
  beforeEach: function(browser) {
    browser.url(url).waitForElementVisible('body');
  },
  after: function(browser) {
    browser.end();
  },

  "Successful registration": function(browser) {
    browser
      .click('#startReg')
      .waitForElementVisible('body')
      .setValue('#name', 'Peter Pal')
      .setValue('#email', 'xxxx@neversendthisemail.org')
      .setValue('#dojo', 'Dojo Name')
      .setValue('#tel', '+36 12 345 6789')
      .click('label[for="mkdeTag"]')
      .click('label[for="dojoleader"]')
      .click('#menu option[value="menu_A"]')
      .click('#ticket option[value="whole"]')
      .click('#quarters option[value="javorka"]')
      .pause(300)
      .click('label[for="d1"]')
      .click('label[for="agree"]')
      .pause(300)
      .click('#reg')
      .waitForElementVisible('#success')
      .assert.visible('#success');
  },

  "Registration is not unique": function(browser) {
    browser
      .click('#startReg')
      .waitForElementVisible('body')
      .setValue('#name', 'Peter Pal')
      .setValue('#email', 'xxxx@neversendthisemail.org')
      .setValue('#dojo', 'Dojo Name')
      .setValue('#tel', '+36 12 345 6789')
      .click('label[for="mkdeTag"]')
      .click('label[for="dojoleader"]')
      .click('#menu option[value="menu_A"]')
      .click('#ticket option[value="whole"]')
      .click('#quarters option[value="javorka"]')
      .click('label[for="d1"]')
      .click('label[for="agree"]')
      .pause(300)
      .click('#reg')
      .waitForElementVisible('#msg')
      .assert.containsText("#msg",
        "Ezzel az email címmel már van regisztráció! [v.reg.not.unique]");
  },

  "Shown menu and javorka limit exceeded message": function(browser) {
    var reg = function() {
      browser
        .url(url)
        .waitForElementVisible('body')
        .click('#startReg')
        .waitForElementVisible('body')
        .setValue('#name', 'Peter Pal')
        .setValue('#email', '2.xxxx@neversendthisemail.org')
        .setValue('#dojo', 'Dojo Name')
        .setValue('#tel', '+36 12 345 6789')
        .click('label[for="mkdeTag"]')
        .click('label[for="dojoleader"]')
        .click('#menu option[value="menu_A"]')
        .click('#ticket option[value="whole"]')
        .click('#quarters option[value="javorka"]')
        .click('label[for="d1"]')
        .click('label[for="agree"]')
        .pause(300);
      return browser;
    }

    // second reg.
    reg()
      .click('#reg')
      .waitForElementVisible('#success')
      .assert.visible('#success');

    // third reg. must show that menu and javorka limit exceeded
    reg()
      .assert.visible('#menuLimit')
      .assert.visible('#d1closed')
      .assert.attributeEquals("#menu", "disabled", "true");
  },

  "Shown quarters limit exceeded message": function(browser) {
    var reg = function(x) {
      browser
        .url(url)
        .waitForElementVisible('body')
        .click('#startReg')
        .waitForElementVisible('body')
        .setValue('#name', 'Peter Pal')
        .setValue('#email', x + '.limit.test@neversendthisemail.org')
        .setValue('#dojo', 'Dojo Name')
        .setValue('#tel', '+36 12 345 6789')
        .click('label[for="mkdeTag"]')
        .click('label[for="dojoleader"]')
        .click('#menu option[value="menu_A"]')
        .click('#ticket option[value="whole"]')
        .click('#quarters option[value="blathy"]')
        .pause(300)
        .click('label[for="d1"]')
        .click('label[for="d2"]')
        .click('label[for="d3"]')
        .click('label[for="agree"]')
        .pause(300);
      return browser;
    }

    // first blathy reg.
    reg(1)
      .click('#reg')
      .waitForElementVisible('#success')
      .assert.visible('#success');
    // second blathy reg.
    reg(2)
      .click('#reg')
      .waitForElementVisible('#success')
      .assert.visible('#success');

    // third reg. must show that quarters limit exceeded
    browser
      .url(url)
      .waitForElementVisible('body')
      .click('#startReg')
      .waitForElementVisible('body')
      .assert.hidden('#javorkaLimit')
      .assert.visible('#blathyLimit')
      .assert.hidden('#dormLimit');
  }
};
