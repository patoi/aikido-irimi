/**
 * Reg. success
 */
'use strict';

module.exports = {
  before: function(browser) {
    browser.url('http://localhost:4000').waitForElementVisible('body');
  },
  after: function(browser) {
    browser.end();
  },
  "Start reg. page": function(browser) {

    browser
      .click('#startReg')
      .waitForElementVisible('body')
      .setValue('#name', 'Peter Pal')
      .setValue('#email', 'istvan.pato@gmail.com')
      .setValue('#dojo', 'Dojo Name')
      .setValue('#tel', '+36 12 345 6789')
      .click('label[for="mkdeTag"]')
      .click('label[for="dojoleader"]')
      .click('#menu option[value="menu_A"]')
      .click('#ticket option[value="whole"]')
      .click('#quarters option[value="javorka"]')
      .click('label[for="agree"]')
      .pause(300)
      .click('#reg')
      .pause(2300);
  }
};
