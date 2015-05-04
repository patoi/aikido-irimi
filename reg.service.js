// registration service
'use strict';

var _ = require('lodash');
var is = require('is_js');
var moment = require('moment-timezone');

var PRICES = {
  'huf': {
    'mkdeTag': {
      'whole': 13000,
      '1day': 4000,
      '2day': 8000,
      '3day': 12000,
      '4day': 16000,
      '1keiko': 2500,
      '2keiko': 5000,
      '3keiko': 7500,
      '4keiko': 10000,
      '5keiko': 12500,
      '6keiko': 15000,
      '7keiko': 17500
    },
    'nonMkdeTag': {
      'whole': 17000,
      '1day': 6000,
      '2day': 12000,
      '3day': 18000,
      '4day': 24000,
      '1keiko': 3500,
      '2keiko': 7000,
      '3keiko': 10500,
      '4keiko': 14000,
      '5keiko': 17500,
      '6keiko': 21000,
      '7keiko': 24500
    },
    'quarters': {
      'javorka': 8400,
      'blathy': 9000
    },
    'menu': {
      'menu_A': 3500,
      'menu_B': 3500,
      'menu_C': 3500,
      'menu_D': 3500,
      'menu_E': 3500,
      'menu_F': 3000,
      'menu_G': 3000,
    }
  }
};

var MAPS = {
  'whole': 'Teljes Edzőtábor',
  '1day': '1 napi jegy',
  '2day': '2 napi jegy',
  '3day': '3 napi jegy',
  '4day': '4 napi jegy',
  '1keiko': '1 edzés jegy',
  '2keiko': '2 edzés jegy',
  '3keiko': '3 edzés jegy',
  '4keiko': '4 edzés jegy',
  '5keiko': '5 edzés jegy',
  '6keiko': '6 edzés jegy',
  '7keiko': '7 edzés jegy',
  'javorka': 'Jávorka Sándor kollégium: aug. 6-8. 3 éj',
  'blathy': 'Bláthy Ottó kollégium: aug. 6-8. 3 éj',
  'menu_A': 'A menü',
  'menu_B': 'B menü',
  'menu_C': 'C menü',
  'menu_D': 'D menü',
  'menu_E': 'E menü',
  'menu_F': 'F menü',
  'menu_G': 'G menü',
};

var getPrice = function(reg) {
  var sum = 0;
  sum = getPriceOfTicket(reg.mkdeTag, reg.ticket);
  sum += getPriceOfMenu(reg.menu);
  sum += getPriceOfQuerters(reg.quarters);
  return sum;
};

var getPriceOfTicket = function(isMkdeTag, ticket) {
  if (ticket) {
    return isMkdeTag ? PRICES['huf']['mkdeTag'][ticket] : PRICES['huf']['nonMkdeTag'][ticket];
  } else {
    return 0;
  }
}

var getPriceOfMenu = function(menu) {
  if (menu) {
    return PRICES['huf']['menu'][menu];
  } else {
    return 0;
  }
}

var getPriceOfQuerters = function(quarters) {
  if (quarters) {
    return PRICES['huf']['quarters'][quarters];
  } else {
    return 0;
  }
}

// validate registration data
var validate = function(reg) {
  var required =
    _.trim(reg.name) &&
    _.trim(reg.email) &&
    _.trim(reg.dojo) &&
    _.trim(reg.tel) &&
    _.trim(reg.ticket) &&
    reg.agree;

  if (!required) {
    throw new Error('v.required');
  } else {}

  var nameRegex = /^([a-zöüóőúéáűíä \-\.]){6,100}$/gi;
  var dojonameRegex = /^([a-zöüóőúéáűíä\ \-\.\']){2,100}$/gi;
  var telRegEx = /^([0-9 \-\+]){7,16}$/gi;

  if (!nameRegex.test(reg.nev)) {
    throw new Error('v.name.error');
  }
  if (!is.email(reg.email)) {
    throw new Error('v.email.error');
  }
  if (!dojonameRegex.test(reg.dojo)) {
    throw new Error('v.dojo.error');
  }
  if (!telRegEx.test(reg.tel)) {
    throw new Error('v.tel.error');
  }
  if (reg.ticket !== 'whole' &&
    reg.ticket !== '1day' &&
    reg.ticket !== '2day' &&
    reg.ticket !== '3day' &&
    reg.ticket !== '4day' &&
    reg.ticket !== '1keiko' &&
    reg.ticket !== '2keiko' &&
    reg.ticket !== '3keiko' &&
    reg.ticket !== '4keiko' &&
    reg.ticket !== '5keiko' &&
    reg.ticket !== '6keiko' &&
    reg.ticket !== '7keiko') {
    throw new Error('v.ticket.error');
  }
  if (reg.quarters &&
    reg.quarters !== 'javorka' &&
    reg.quarters !== 'blathy') {
    throw new Error('v.quarters.error');
  }
  if (reg.agree !== true) {
    throw new Error('v.agree.error');
  }
  return true;
};

// transform registration
var transform = function(reg) {
  var regNew = _.clone(reg);
  regNew.name = reg.name ? reg.name.toUpperCase() : reg.name;
  regNew.email = reg.email ? reg.email.toLowerCase() : reg.email;
  regNew.dojo = reg.dojo ? reg.dojo.toUpperCase() : reg.dojo;
  regNew.time = moment().tz("Europe/Budapest").format('YYYY.MM.DD HH:mm:ss');
  return regNew;
};

// registration email
var toHtml = function(reg) {

  var rowRender = function(header, value) {
    header = header || '&nbsp;';
    value = value || '&nbsp;';
    return '<div class="row"><div class="col s6" style="display: inline-block; width: 180px;">' + header + '</div><div class="col s6" style="display: inline-block; font-weight: bold">' + value + '</div></div>';
  };

  var fullRowRender = function(value) {
    value = value || '&nbsp;';
    return '<div class="row"><div class="col s12" style="display: inline-block;">' + value + '</div></div>';
  };

  var txt = '';
  txt += '<html><head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.96.1/css/materialize.min.css"></head><body style="background-color: #fff">'
  txt += '<div class="container">'
  txt += '<h3 class="blue-text">Aikido 2015 regisztráció</h3>'
  txt += rowRender('Reg. kód', reg._id);
  txt += rowRender('Reg. időpont', reg.time);
  txt += rowRender('Név', reg.name);
  txt += rowRender('Email', reg.email);
  txt += rowRender('Dojo', reg.dojo);
  txt += rowRender('Telefon', reg.tel);
  txt += rowRender('MKDE tag', (reg.mkdeTag ? 'Igen' : 'Nem'));
  txt += rowRender('Dojo vezető', (reg.dojoleader ? 'Igen' : 'Nem'));
  txt += rowRender('Edzés jegy', MAPS[reg.ticket] + ' - ' + getPriceOfTicket(reg.mkdeTag, reg.ticket) + " HUF");
  if (reg.menu) {
    txt += rowRender('Menü', MAPS[reg.menu] + ' - ' + getPriceOfMenu(reg.menu) + " HUF");
  }
  if (reg.quarters) {
    txt += rowRender('Szállás', MAPS[reg.quarters] + ' - ' + getPriceOfQuerters(reg.quarters) + " HUF");
  }
  txt += rowRender('\nUtalandó összeg', reg.price + " HUF");
  txt += fullRowRender('Elfogadom a rendezvényre és a regisztrációra vonatkozó feltételeket.');
  txt += fullRowRender('A közlemény rovatban legyetek szívesek feltüntetni a neveteket!');
  txt += fullRowRender('Az alábbi bankszámlára utalhatod a fenti összeget:<br/>Számla tulajdonosa:<span style="font-weight: 400">Virga János</span><br/>Budapest Bank:<span style="font-weight: 400">10103623-25432900-01000004</span>');
  txt += fullRowRender('<b>Fontos </b>Regisztrációd csak a beérkezett összeg után válik érvényessé. A befizetésedről néhány napon belül kapsz egy visszaigazoló emailt. Ha nem kapsz ilyet, akkor vedd fel a kapcsolatot a megadott email címen!');
  txt += fullRowRender('Köszönjük a regisztrációdat!<br/>Szervezők');
  txt += '</div></body></html>';
  return txt;
};

// all registration as CSV
var getAllRegAsCSV = function(regList) {
  var txt = 'Sorszám,kód,idő,név,email,dojo,tel.,mkde tag,dojo vez.,kollégium,koll. ár,menü,menüár,jegy,jegyár,fizetendő,pénznem\n';
  var addReg = function(reg) {
    return (i + 1) + ',' + reg._id + ',' + reg.time + ',' + reg.name + ',' + reg.email + ',' + reg.dojo + ',\'' + reg.tel + ',' + (reg.mkdeTag ? 'I' : 'N') + ',' + (reg.dojoleader ? 'I' : 'N') + ',' + (reg.quarters ? reg.quarters : '') + ',' + getPriceOfQuerters(reg.quarters) + ',' + (reg.menu ? reg.menu : '') + ',' + getPriceOfMenu(reg.menu) + ',' + MAPS[reg.ticket] + ',' + getPriceOfTicket(reg.mkdeTag, reg.ticket) + ',' + reg.price + ',HUF';
  };
  for (var i = 0; regList.length > i; i++) {
    txt += addReg(regList[i]) + '\n';
  }
  return txt;
};

exports.validate = validate;
exports.transform = transform;
exports.toHtml = toHtml;
exports.getPrice = getPrice;
exports.getAllRegAsCSV = getAllRegAsCSV;
exports.PRICES = PRICES;
