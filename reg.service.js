// registration service
'use strict';

var _ = require('lodash');
var is = require('is_js');
var moment = require('moment-timezone');

var DISCOUNTS = {
  deadline: -20,
  mkde: -10,
  dojoleader: -20
};

// FIXME: euro
var PRICES = {
  'huf': {
    'workout': {
      'teljes': 20000,
      '1napi': 6000,
      '2napi': 12000,
      '3napi': 18000,
      '4napi': 24000,
      '1edzes': 4000,
      '2edzes': 8000,
      '3edzes': 12000,
      '4edzes': 16000,
      '5edzes': 20000,
      '6edzes': 24000,
      '7edzes': 28000
    },
    'accommodation': {
      '1agyas': 24000,
      '2agyas': 18000
    },
    'banquet': 8000,
    'meal': {
      'breakfast': 2000 * 3,
      'lunch': 3000 * 3,
      'dinner': 2000 * 3
    }
  }
};

var MAPS = {
  'teljes': 'Teljes edzőtábor jegy',
  '1napi': '1 napos edzésjegy',
  '2napi': '2 napos edzésjegy',
  '3napi': '3 napos edzésjegy',
  '4napi': '4 napos edzésjegy',
  '1edzes': '1 edzésjegy',
  '2edzes': '2 edzésjegy',
  '3edzes': '3 edzésjegy',
  '4edzes': '4 edzésjegy',
  '5edzes': '5 edzésjegy',
  '6edzes': '6 edzésjegy',
  '7edzes': '7 edzésjegy',
  '1agyas': '1 ágyas szoba',
  '2agyas': '2 ágyas szoba',
  'huf': 'Forint',
  'euro': 'Euro'
};

var getPrice = function(reg, deadlineDiscount) {
  var sum = 0;
  if (reg.penznem !== 'huf' && reg.penznem !== 'euro') {
    throw new Error('v.unknown.currency');
  }
  var sumDiscounts = reg.mkdeTag ? DISCOUNTS['mkde'] : 0;
  sumDiscounts += reg.dojovezeto ? DISCOUNTS['dojoleader'] : 0;
  sumDiscounts += deadlineDiscount ? DISCOUNTS['deadline'] : 0;
  sum += PRICES[reg.penznem]['workout'][reg.edzesjegy] * ((100 + sumDiscounts) / 100);
  sum += reg.bankett ? PRICES[reg.penznem]['banquet'] : 0;
  if (reg.szallas) {
    sum += PRICES[reg.penznem]['accommodation'][reg.szallas];
  }
  if (reg.etkezes) {
    sum += reg.etkezes.reggeli ? PRICES[reg.penznem]['meal']['breakfast'] : 0;
    sum += reg.etkezes.ebed ? PRICES[reg.penznem]['meal']['lunch'] : 0;
    sum += reg.etkezes.vacsora ? PRICES[reg.penznem]['meal']['dinner'] : 0;
  }
  return sum;
};

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
  regNew.dojo = reg.dojo ? reg.dojo.toUpperCase() : reg.dojo;
  regNew.time = moment().tz("Europe/Budapest").format('YYYY.MM.DD hh:mm:ss');;
  return regNew;
};

// registration email
var toHtml = function(reg) {

  var rowRender = function(header, value) {
    header = header || '&nbsp;';
    value = value || '&nbsp;';
    return '<div class="row" style="height: 1.4em"><div class="col s6" style="display: inline-block; width: 180px;">' + header + '</div><div class="col s6" style="display: inline-block; font-weight: bold">' + value + '</div></div>';
  };

  var txt = '';
  txt += '<html><head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.96.1/css/materialize.min.css"></head><body style="background-color: #fff">'
  txt += '<div class="container">'
  txt += '<h3 class="blue-text">Aikido 2015 regisztráció</h3>'
  txt += rowRender('Reg. kód', reg._id);
  txt += rowRender('Reg. időpont', reg.time);
  txt += rowRender('Név', reg.nev);
  txt += rowRender('Email', reg.email);
  txt += rowRender('Dojo', reg.dojo);
  txt += rowRender('Telefon', reg.tel);
  // txt += rowRender('Pénznem', MAPS[reg.penznem]);
  txt += rowRender('', '');
  txt += rowRender('MKDE tag', (reg.mkdeTag ? 'Igen' : 'Nem'));
  txt += rowRender('Dojo vezető', (reg.dojovezeto ? 'Igen' : 'Nem'));
  txt += rowRender('Bankett jegy', (reg.bankett ? 'Igen' : 'Nem'));
  txt += rowRender('Edzés jegy', MAPS[reg.edzesjegy]);

  if (reg.etkezes) {
    txt += rowRender('', '');
    txt += rowRender('Szállás', MAPS[reg.szallas]);
    txt += rowRender('Étkezés', (reg.etkezes.reggeli ? 'Reggeli' : '-------'));
    txt += (reg.etkezes.ebed ? ' Ebéd' : ' ----');
    txt += (reg.etkezes.vacsora ? ' Vacsora' : '-------');
  }
  txt += rowRender('', '');
  txt += rowRender('\nUtalandó összeg', reg.price + " " + MAPS[reg.penznem]);
  txt += rowRender('', '');
  txt += '<div class="row" style="height: 1.4em"><div class="col s12" style="display: inline-block;">Elfogadom a rendezvényre és a regisztrációra vonatkozó feltételeket.</div></div>';
  txt += '</div></body></html>';
  return txt;
};

exports.validate = validate;
exports.transform = transform;
exports.toHtml = toHtml;
exports.getPrice = getPrice;
exports.PRICES = PRICES;
