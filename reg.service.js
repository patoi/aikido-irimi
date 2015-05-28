// registration service
'use strict';

var _ = require('lodash');
var is = require('is_js');
var moment = require('moment-timezone');

var PRICES = {
  'huf': {
    'tshirt': 2601,
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
      'javorka': 2800,
      'blathy': 3000
    },
    'menu': {
      'menu_A': 3500,
      'menu_B': 3500,
      'menu_C': 3500,
      'menu_D': 3500,
      'menu_E': 3500,
      'menu_F': 3000,
      'menu_G': 3000
    }
  }
};

var MAPS = {
  'hu': {
    'mHeader': 'Aikido 2015 regisztráció',
    'mRegCode': 'Reg. kód',
    'mRegTime': 'Reg. időpont',
    'mNev': 'Név',
    'mPhone': 'Telefonszám',
    'mMkde': 'MKDE tag',
    'mLeader': 'Dojo vezető',
    'mTicket': 'Edzésjegy',
    'mMenu': 'Menü',
    'mQuarters': 'Szállás',
    'md1': 'Csütörtök',
    'md2': 'Péntek',
    'md3': 'Szombat',
    'mPrice': 'Utalandó összeg',
    'mAgree': 'Elfogadom a rendezvényre és a regisztrációra vonatkozó feltételeket.',
    'mComment': '<b>A közlemény rovatban legyetek szívesek feltüntetni a neveteket!</b>',
    'mBankAccount': 'Az alábbi bankszámlára utalhatod a fenti összeget:<br/>Számla tulajdonosa:<span style="font-weight: 400">Virga János</span><br/>Budapest Bank:<span style="font-weight: 400">10103623-25432900-01000004</span>',
    'mValid': '<b>Fontos </b>Regisztrációd csak a beérkezett összeg után válik érvényessé. A befizetésedről néhány napon belül kapsz egy visszaigazoló emailt. Ha nem kapsz ilyet, akkor vedd fel a kapcsolatot a megadott email címen!',
    'mThanks': 'Köszönjük a regisztrációdat!<br/>Szervezők',
    'mYes': 'Igen',
    'mNo': 'Nem',
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
    'javorka': 'Jávorka Sándor kollégium',
    'blathy': 'Bláthy Ottó kollégium',
    'menu_A': 'A menü',
    'menu_B': 'B menü',
    'menu_C': 'C menü',
    'menu_D': 'D menü',
    'menu_E': 'E menü',
    'menu_F': 'F menü',
    'menu_G': 'G menü',
    'tshirt': 'Póló',
    'white': 'Fehér',
    'black': 'Fekete'
  },
  'en': {
    'mHeader': 'Aikido 2015 Registration',
    'mRegCode': 'Reg. id',
    'mRegTime': 'Reg. time',
    'mNev': 'Name',
    'mPhone': 'Phone number',
    'mMkde': 'MKDE member',
    'mLeader': 'Dojo leader',
    'mTicket': 'Ticket',
    'mMenu': 'Menu',
    'mQuarters': 'Quarters',
    'md1': 'Thursday',
    'md2': 'Friday',
    'md3': 'Saturday',
    'mPrice': 'Total',
    'mAgree': 'The registration became valid, after the transferred amount is arrived to our account!',
    'mComment': '<b>Please give your name in the transfer details!</b>',
    'mBankAccount': 'Transfer the money to the next bank account:<br/>Bank Account Owner:<span style="font-weight: 400">Virga János</span><br/>Budapest Bank:<span style="font-weight: 400">10103623-25432900-01000004</span>',
    'mValid': '<b>Important </b>Your payment will be confirmed with an email. If you don\'t get confirmation email, please send an email to organizer.',
    'mThanks': 'Thank you for registration!<br/>The Organizer',
    'mYes': 'Yes',
    'mNo': 'No',
    'whole': 'Whole Camp',
    '1day': '1 day',
    '2day': '2 day',
    '3day': '3 day',
    '4day': '4 day',
    '1keiko': '1 keiko',
    '2keiko': '2 keiko',
    '3keiko': '3 keiko',
    '4keiko': '4 keiko',
    '5keiko': '5 keiko',
    '6keiko': '6 keiko',
    '7keiko': '7 keiko',
    'javorka': 'Jávorka Sándor Dorm',
    'blathy': 'Bláthy Ottó Dorm',
    'menu_A': 'Menu A',
    'menu_B': 'Menu B',
    'menu_C': 'Menu C',
    'menu_D': 'Menu D',
    'menu_E': 'Menu E',
    'menu_F': 'Menu F',
    'menu_G': 'Menu G',
    'tshirt': 'T-shirt',
    'white': 'White',
    'black': 'Black'
  }
};

var getPrice = function(reg) {
  var sum = 0;
  sum = getPriceOfTicket(reg.mkdeTag, reg.ticket);
  sum += getPriceOfMenu(reg.menu);
  sum += getPriceOfQuerters(reg);
  sum += getPriceOfTshirt(reg.tshirt);
  return sum;
};

var getPriceOfTicket = function(isMkdeTag, ticket) {
  if (ticket) {
    return isMkdeTag ? PRICES['huf']['mkdeTag'][ticket] : PRICES['huf']['nonMkdeTag'][ticket];
  } else {
    return 0;
  }
}

var getPriceOfTshirt = function(tshirt) {
  var tshirtPrice = 0;
  if (tshirt) {
    for (var property in tshirt) {
      if (tshirt.hasOwnProperty(property) && tshirt[property]) {
        if (tshirt[property] < 0 || tshirt[property] > 5) {
          // invalid valuet
          throw new Error('v.invalid.tshirt.price');
        } else {
          tshirtPrice += PRICES['huf'].tshirt * tshirt[property];
        }
      }
    }
  }
  return tshirtPrice;
}

var getPriceOfMenu = function(menu) {
  if (menu) {
    return PRICES['huf']['menu'][menu];
  } else {
    return 0;
  }
}

var getPriceOfQuerters = function(reg) {
  if (reg.quarters) {
    var quartersPrice = 0;
    quartersPrice += reg.d1 ? PRICES['huf']['quarters'][reg.quarters] : 0;
    quartersPrice += reg.d2 ? PRICES['huf']['quarters'][reg.quarters] : 0;
    quartersPrice += reg.d3 ? PRICES['huf']['quarters'][reg.quarters] : 0;
    return quartersPrice;
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
  if (reg.tshirt) {
    for (var property in reg.tshirt) {
      if (reg.tshirt.hasOwnProperty(property) && reg.tshirt[property]) {
        if (reg.tshirt[property] < 0 || reg.tshirt[property] > 5) {
          // invalid value
          throw new Error('v.tshirt.error');
        }
      }
    }
  }
  if (reg.quarters) {
    if (reg.quarters !== 'javorka' &&
      reg.quarters !== 'blathy') {
      throw new Error('v.quarters.error');
    }
    if (!reg.d1 && !reg.d2 && !reg.d3) {
      throw new Error('v.quarters.required');
    }
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
  txt += '<h3 class="blue-text">' + MAPS[reg.lang].mHeader + '</h3>'
  txt += rowRender(MAPS[reg.lang].mRegCode, reg._id);
  txt += rowRender(MAPS[reg.lang].mRegTime, reg.time);
  txt += rowRender(MAPS[reg.lang].mNev, reg.name);
  txt += rowRender('Email', reg.email);
  txt += rowRender('Dojo', reg.dojo);
  txt += rowRender(MAPS[reg.lang].mPhone, reg.tel);
  txt += rowRender(MAPS[reg.lang].mMkde, (reg.mkdeTag ? MAPS[reg.lang].mYes : MAPS[reg.lang].mNo));
  txt += rowRender(MAPS[reg.lang].mLeader, (reg.dojoleader ? MAPS[reg.lang].mYes : MAPS[reg.lang].mNo));
  txt += rowRender(MAPS[reg.lang].mTicket, MAPS[reg.lang][reg.ticket] + ' : ' + getPriceOfTicket(reg.mkdeTag, reg.ticket) + ' HUF');
  if (reg.menu) {
    txt += rowRender(MAPS[reg.lang].mMenu, MAPS[reg.lang][reg.menu] + ' : ' + getPriceOfMenu(reg.menu) + ' HUF');
  }
  if (reg.quarters) {
    txt += rowRender(MAPS[reg.lang].mQuarters, MAPS[reg.lang][reg.quarters] + ': ' + (reg.d1 ? MAPS[reg.lang].md1 + ' ' : '') + (reg.d2 ? MAPS[reg.lang].md2 + ' ' : '') + (reg.d3 ? MAPS[reg.lang].md3 : '') + ' : ' + getPriceOfQuerters(reg) + ' HUF');
  }

  if (reg.tshirt) {
    var isAllEmpty = true;
    var tshirtList = '';
    for (var property in reg.tshirt) {
      if (reg.tshirt.hasOwnProperty(property) && reg.tshirt[property]) {
        isAllEmpty = false;
        tshirtList += (property.charAt(0) == 'w' ? MAPS[reg.lang].white : MAPS[reg.lang].black) + ' ' + property.toUpperCase().substring(1) + ': ' + reg.tshirt[property] + ', ';
      }
    }
    if (!isAllEmpty) {
      var tshirtPrice = getPriceOfTshirt(reg.tshirt);
      tshirtList += ': ' + tshirtPrice + ' HUF';
      txt += rowRender(MAPS[reg.lang].tshirt, tshirtList);
    }
  }
  txt += rowRender('\n' + MAPS[reg.lang].mPrice, reg.price + ' HUF');
  txt += fullRowRender(MAPS[reg.lang].mAgree);
  txt += fullRowRender(MAPS[reg.lang].mComment);
  txt += fullRowRender(MAPS[reg.lang].mBankAccount);
  txt += fullRowRender(MAPS[reg.lang].mValid);
  txt += fullRowRender(MAPS[reg.lang].mThanks);
  txt += '</div></body></html>';
  return txt;
};

// all registration as CSV
var getAllRegAsCSV = function(regList) {
  var txt = 'sorszám,nyelv,kód,idő,név,email,dojo,tel.,mkde tag,dojo vez.,kollégium,CS,P,SZ,koll. ár,menü,menüár,jegy,jegyár,fizetendő,pénznem\n';
  var addReg = function(reg) {
    return (i + 1) + ',' + reg.lang + ',' + reg._id + ',' + reg.time + ',' + reg.name + ',' + reg.email + ',' + reg.dojo + ',\'' + reg.tel + ',' + (reg.mkdeTag ? 'I' : 'N') + ',' + (reg.dojoleader ? 'I' : 'N') + ',' + (reg.quarters ? reg.quarters : '') + ',' + (reg.d1 ? "I" : "") + ',' + (reg.d2 ? "I" : "") + ',' + (reg.d3 ? "I" : "") + ',' + getPriceOfQuerters(reg) + ',' + (reg.menu ? reg.menu : '') + ',' + getPriceOfMenu(reg.menu) + ',' + MAPS[reg.ticket] + ',' + getPriceOfTicket(reg.mkdeTag, reg.ticket) + ',' + reg.price + ',HUF';
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
