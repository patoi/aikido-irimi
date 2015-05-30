'use strict';

app.config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('en', {
    'lang': 'en',
    'bq': 'banquett',
    'reg_step': 'Registration steps:',
    'reg_step_1': 'Check the prices!',
    'reg_step_2': 'Sign up!',
    'reg_step_3': 'Select T-shirts!',
    'reg_step_4': 'We send an email with your registration data and payment method.',
    'reg_step_5': 'Check emails and transfer the amount.',
    'events': 'Events calendar and examination date',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday',
    'demo': 'embu',
    'danexam': 'Dan Test',
    'ticketPrice': 'Ticket price - Hungarian Forint HUF',
    'mkdeM': 'MKDE member',
    'noMkdeM': 'not MKDE member',
    'ticket': 'Ticket',
    'prepaid': 'Prepaid',
    'onsite': 'Onsite',
    'wholeCamp': 'Whole Camp',
    'dailyTicket': 'Daily Ticket',
    'keikoTicket': 'Training Ticket',
    'title': 'Aikido Training Camp',
    'locationStr': 'Location',
    'address': 'Address',
    'ab': 'Anniversary Banquet',
    'abText': 'In 2015 we are celebrating our 15th anniversary of the founding of the Renseikan Dojo - Tatabánya. The number of the seats are 80, there is no Banquet ticket but conditions for participation is that you must order a menu. Drinks is not included. You find the menu list in the registration form.',
    'abSuite': 'We ask that you arrive punctually, appropriate clothing.',
    'quartersAccom': 'You can booking quarters in the registration. Quarters are dorms and rooms has several beds:',
    'transfer': 'Payment',
    'paymentDetails': 'We are calculating the registration price and you can transfer it to the next bank account:',
    'roomsandbeds': 'Rooms and beds',
    'from': '06 Aug 2015',
    'to': '09 Aug 2015',
    'location': '2890 Tata, Tanoda tér 5. - Eötvös József high school\'s gym',
    'reg': 'Registration',
    'regDeadLine': 'Online registration deadline:',
    'organizer': 'ORGANIZER',
    'organizer-name': 'Renseikan Aikido Association',
    'mkde': 'member of the Hungarian Kobayashi Dojos\' Federation',
    'reg-form': 'Registration form',
    'label-name': 'Name',
    'validate-name': 'Minimum 6, maximum 100 characters',
    'validate-email': 'Invalid email address',
    'validate-dojo': 'Minimum 2, maximum 100 characters',
    'validate-tel': 'Valid characters are numbers, space, hyphen and plus sign, the length between 7 to 16',
    'label-tel': 'Phone',
    'label-mkdetag': 'I am an MKDE member',
    'label-dojoleader': 'I am a Dojo leader',
    'option-label-ticket': 'Choose a ticket!',
    'whole': 'Whole Training Camp',
    '1day': 'One day',
    '2day': 'Two day',
    '3day': 'Three day',
    '4day': 'Four day',
    '1keiko': '1 training ticket',
    '2keiko': '2 training ticket',
    '3keiko': '3 training ticket',
    '5keiko': '5 training ticket',
    '6keiko': '6 training ticket',
    '7keiko': '7 training ticket',
    '4keiko': '4 training ticket',
    'agreement': 'The registration became valid, after the transferred amount is arrived to our account!',
    'agree': 'Agree',
    'option-label-menu': 'No booking to Banquet',
    'lang-en': 'English',
    'lang-hu': 'Magyar',
    'label-menu': 'Choose a menu, if you want booking to banquet!',
    'a-menu-list': 'Show menu',
    'menu_A': 'Menu A',
    'menu_B': 'Menu B',
    'menu_C': 'Menu C',
    'menu_D': 'Menu D',
    'menu_E': 'Menu E',
    'menu_F': 'Menu F',
    'menu_G': 'Menu G',
    'vega': 'vegetarian menu',
    'option-label-quarters': 'No booking quarters',
    'javorka': 'Jávorka Sándor dorm',
    'blathy': 'Bláthy Ottó dorm',
    'calcPrice': 'Total',
    'no-banquet': 'You can\'t booking to banquet, because we have exceeded the maximum limit.',
    'no-javorka': 'All of the rooms rented in the Jávorka Sándor dorm.',
    'no-blathy': 'All of the rooms rented in the Bláthy Ottó dorm.',
    'no-quarters': 'All of the rooms rented.',
    'important': 'Important',
    'reg-success': 'Successful registration!',
    'reg_msg1': 'We have sent an email to you with your registration.',
    'reg_msg2': 'The registration became valid, after the transferred amount is arrived to our account! Your payment will be confirmed with an email. If you don\'t get confirmation email, please send an email to organizer.',
    'quarters': 'Quarters',
    'hufpersonnight': 'HUF/person/night',
    'baOwner': 'Bank Account Owner',
    'trDetails': 'Please give your name in the transfer details!',
    'label-tshirt': 'If you want to order T-shirt, please click here:',
    'label-tshirt-order': 'T-shirt order form',
    'label-tshirt-view': 'Show T-shirt',
    'label-tshirt-num': 'Choose T-shirts!',
    'a-tshirt': 'show',
    'label-ws': 'White S',
    'label-wm': 'White M',
    'label-wl': 'White L',
    'label-wxl': 'White XL',
    'label-wxxl': 'White XXL',
    'label-wxxxl': 'White XXXL',
    'validate-tshirt': 'Number: 1-5',
    'label-bs': 'Black S',
    'label-bm': 'Black M',
    'label-bl': 'Black L',
    'label-bxl': 'Black XL',
    'label-bxxl': 'Black XXL',
    'label-bxxxl': 'Black XXXL',
    'tshirt-order': 'Ordering T-shirt',
    'tshirt-order-desc': 'You can order online the T-shirts and take over between keiko. The appearance of T-shirts: ',
    'tshirt-price': 'T-shirt price',
    'tshirt-desc': 'The T-shirts are available in black and white colors.'
  });

  $translateProvider.translations('hu', {
    'lang': 'hu',
    'bq': 'bankett',
    'reg_step': 'Az következőképpen regisztrálhatsz az Aikido edzőtáborra:',
    'reg_step_1': 'Tekintsd át az árakat!',
    'reg_step_2': 'Regisztrálj!',
    'reg_step_3': 'Add meg, hogy milyen pólót szeretnél rendelni!',
    'reg_step_4': 'A rendelésedről és regisztrációdról emailt küldünk, melyben szerepelnek az utaláshoz szükséges adatok.',
    'reg_step_5': 'Ellenőrizd a regisztrációs emailt, majd utald át az összeget.',
    'events': 'Rendezvénynaptár és vizsga időpont',
    'thursday': 'Csütörtök',
    'friday': 'Péntek',
    'saturday': 'Szombat',
    'sunday': 'Vasárnap',
    'demo': 'bemutató',
    'danexam': 'Dan Vizsga',
    'ticketPrice': 'Jegyárak forintban',
    'mkdeM': 'MKDE tagoknak',
    'noMkdeM': 'Nem MKDE tagoknak',
    'ticket': 'Jegy',
    'prepaid': 'Elővétel',
    'onsite': 'Helyszínen',
    'wholeCamp': 'Teljes tábor',
    'dailyTicket': 'Napijegy',
    'keikoTicket': 'Edzésjegy',
    'title': 'Aikido Edzőtábor',
    'locationStr': 'Helyszín',
    'address': 'Cím',
    'ab': 'Évfordulós Bankett',
    'abText': 'Évfordulós bankettünkön megünnepeljük, hogy a Renseikan Dojo - Tatabánya idén ünnepli 15. éves évfordulóját. A bankett 80 főre biztosított, 19-21 óra között zártkörű, amelyre külön belépőjegy nincs, a menürendelés a részvétel feltétele. A bankett 21 órától nyílt lesz, foglalás nélkül is be lehet menni. Az ital fogyasztása egyénileg, külön fizetendő. A részletes menüt és árakat a regisztrációnál megtalálod.',
    'abSuite': 'Kérünk, hogy a bankettre pontosan érkezz, megfelelő ruházatban.',
    'quartersAccom': 'A szállás igény szerint a regisztrációkor foglalható. Az elhelyezés kollégiumokban történik, többágyas szobákban:',
    'transfer': 'Utalás',
    'paymentDetails': 'A regisztrációban megadott alapján kiszámoljuk az összeget, amelyet az alábbi bankszámlára utalhatsz:',
    'roomsandbeds': 'Szobakiosztások és ágyak száma',
    'from': '2015. augusztus 6.',
    'to': '2015. augusztus 9.',
    'location': '2890 Tata, Tanoda tér 5. - Eötvös József gimnázium tornaterme',
    'reg': 'Regisztráció',
    'regDeadLine': 'Online regisztrációs határidő:',
    'organizer': 'SZERVEZŐ',
    'organizer-name': 'Renseikan Aikido Egyesület',
    'mkde': 'Magyarországi Kobayashi Dojok Egyesületének tagja',
    'reg-form': 'Regisztrációs űrlap',
    'label-name': 'Név',
    'validate-name': 'Minimum 6, maximum 100 karakter',
    'validate-email': 'Nem érvényes a megadott email cím',
    'validate-dojo': 'Minimum 2, maximum 100 karakter',
    'validate-tel': 'Csak számot, szóközt, kötőjelet és + jel adható meg 7-16 hosszon',
    'label-tel': 'Telefon',
    'label-mkdetag': 'MKDE tag vagyok',
    'label-dojoleader': 'Dojo vezető vagyok',
    'option-label-ticket': 'Válassz jegyet!',
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
    'agreement': 'A fent leírtakat elolvastam és tudomásul vettem, az összeget átutalom. A regisztráció csak a befizetett összeg beérkezését követően válik érvényessé!',
    'agree': 'Elfogadom',
    'lang-en': 'English',
    'lang-hu': 'Magyar',
    'option-label-menu': 'Nem megyek bankettre',
    'label-menu': 'Ha szeretnél bankettre menni, akkor válassz egy menüt!',
    'a-menu-list': 'Menü megtekintése',
    'menu_A': 'A menü',
    'menu_B': 'B menü',
    'menu_C': 'C menü',
    'menu_D': 'D menü',
    'menu_E': 'E menü',
    'menu_F': 'F menü',
    'menu_G': 'G menü',
    'vega': 'vegetáriánus menü',
    'option-label-quarters': 'Nem igénylek szállást',
    'javorka': 'Jávorka Sándor kollégium',
    'blathy': 'Bláthy Ottó kollégium',
    'calcPrice': 'Összesen',
    'no-banquet': 'Sajnáljuk, de már nincs több hely a bankettre.',
    'no-javorka': 'Már minden szoba ki lett adva a Jávorka Sándor kollégiumban.',
    'no-blathy': 'Már minden szoba ki lett adva a Bláthy Ottó kollégiumban.',
    'no-quarters': 'Sajnáljuk, de már minden szoba ki lett adva.',
    'important': 'Fontos',
    'reg-success': 'Regisztrációd sikeres!',
    'reg_msg1': 'Regisztrációs adataidról és az utalandó összegről emailt küldtünk.',
    'reg_msg2': 'Regisztrációd csak a beérkezett összeg után válik érvényessé. A befizetésedről néhány napon belül kapsz egy visszaigazoló emailt. Ha nem kapsz ilyet, akkor vedd fel a kapcsolatot a megadott email címen!',
    'quarters': 'Szállás',
    'hufpersonnight': 'Ft/fő/éj',
    'baOwner': 'Számla tulajdonosa',
    'trDetails': 'Az utalás közlemény rovatában add meg a neved!',
    'label-tshirt': 'Amennyiben pólót szeretnél rendelni, klikkents ide:',
    'label-tshirt-order': 'póló rendelés megjelenítése',
    'label-tshirt-view': 'Póló kinézet megtekintése',
    'label-tshirt-num': 'Add meg, hogy mely pólókból mennyit szeretnél rendelni!',
    'a-tshirt': 'megtekintés',
    'label-ws': 'Fehér S',
    'label-wm': 'Fehér M',
    'label-wl': 'Fehér L',
    'label-wxl': 'Fehér XL',
    'label-wxxl': 'Fehér XXL',
    'label-wxxxl': 'Fehér XXXL',
    'validate-tshirt': 'Szám: 1-5',
    'label-bs': 'Fekete S',
    'label-bm': 'Fekete M',
    'label-bl': 'Fekete L',
    'label-bxl': 'Fekete XL',
    'label-bxxl': 'Fekete XXL',
    'label-bxxxl': 'Fekete XXXL',
    'tshirt-order': 'Póló rendelés',
    'tshirt-order-desc': 'Lehetőség van póló rendelésre is. A pólókat az edzőtáborban lehet személyesen átvenni az edzések közötti szünetben. A pólók kinézete megtekinthető itt: ',
    'tshirt-price': 'Póló ár',
    'tshirt-desc': 'A pólók fekete és fehér színben rendelhetők.'
  });

  $translateProvider.preferredLanguage('hu');
  $translateProvider.useLocalStorage();

}]);
