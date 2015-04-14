// registration service
'use strict';

var _ = require('lodash');
var is = require('is_js');

// validate registration data
var validate = function(reg) {
  var required =
    _.trim(reg.nev) &&
    _.trim(reg.email) &&
    _.trim(reg.dojo) &&
    _.trim(reg.tel) &&
    _.trim(reg.penznem) &&
    _.trim(reg.edzesjegy) &&
    reg.elfogadom;

  if (!required) {
    throw new Error('v.required');
  } else {}

  var nevRegEx = /^([a-zöüóőúéáűíä \-\.]){6,100}$/gi;
  var dojoNevRegEx = /^([a-zöüóőúéáűíä \-\.]){6,100}$/gi;
  var telRegEx = /^([0-9 \-\+]){7,16}$/gi;

  if (!nevRegEx.test(reg.nev)) {
    throw new Error('v.nev.hiba');
  }
  if (!is.email(reg.email)) {
    throw new Error('v.email.hiba');
  }
  if (!dojoNevRegEx.test(reg.dojo)) {
    throw new Error('v.dojo.hiba');
  }
  if (!telRegEx.test(reg.tel)) {
    throw new Error('v.tel.hiba');
  }
  if (reg.penznem !== 'huf' && reg.penznem !== 'euro') {
    throw new Error('v.penznem.hiba');
  }
  if (reg.edzesjegy !== 'teljes' &&
    reg.edzesjegy !== '1napi' &&
    reg.edzesjegy !== '2napi' &&
    reg.edzesjegy !== '3napi' &&
    reg.edzesjegy !== '4napi' &&
    reg.edzesjegy !== '1edzes' &&
    reg.edzesjegy !== '2edzes' &&
    reg.edzesjegy !== '3edzes' &&
    reg.edzesjegy !== '4edzes' &&
    reg.edzesjegy !== '5edzes' &&
    reg.edzesjegy !== '6edzes' &&
    reg.edzesjegy !== '7edzes') {
    throw new Error('v.edzesjegy.hiba');
  }
  if (reg.szallas &&
    reg.szallas !== '2agyas' &&
    reg.szallas !== '1agyas') {
    throw new Error('v.szallas.hiba');
  }
  if (reg.elfogadom !== true) {
    throw new Error('v.elfogadom.hiba');
  }
  return true;
};

// transform registration
var transform = function(reg) {
  var regNew = _.clone(reg);
  regNew.nev = reg.nev ? reg.nev.toUpperCase() : reg.nev;
  regNew.email = reg.email ? reg.email.toLowerCase() : reg.email;
  regNew.dojo = reg.dojo.toUpperCase();
  return regNew;
};

// registration email
var toText = function(reg) {
  var txt = '';
  txt += 'Aikido 2015 regisztráció\n'
  txt += _.padRight('\nReg. kód: ', 20) + reg._id;
  txt += _.padRight('\nNév: ', 20) + reg.nev;
  txt += _.padRight('\nEmail: ', 20) + reg.email;
  txt += _.padRight('\nDojo: ', 20) + reg.dojo;
  txt += _.padRight('\nTelefon: ', 20) + reg.tel;
  txt += _.padRight('\nPénznem: ', 20) + reg.penznem;
  txt += _.padRight('\nMKDE tag: ', 20) + (reg.mkdeTag ? 'Igen' : 'Nem');
  txt += _.padRight('\nDojo vezető: ', 20) + (reg.dojovezeto ? 'Igen' : 'Nem');
  txt += _.padRight('\nBankett jegy: ', 20) + (reg.bankett ? 'Igen' : 'Nem');
  txt += _.padRight('\nEdzés jegy: ', 20) + reg.edzesjegy; // FIXME: resolution codes
  txt += _.padRight('\nSzállás: ', 20) + reg.szallas;
  txt += _.padRight('\nÉtkezés: ', 20) + (reg.etkezes.reggeli ? 'Reggeli' : '-------')
  txt += (reg.etkezes.ebed ? ' Ebéd' : ' ----');
  txt += (reg.etkezes.vacsora ? ' Vacsora' : '-------');
  txt += '\nElfogadom a rendezvényre és a regisztrációra vonatkozó feltételeket.';
  return txt;
};

exports.validate = validate;
exports.transform = transform;
exports.toText = toText;
