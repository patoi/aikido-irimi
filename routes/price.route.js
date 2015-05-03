// registration price service
'use strict';

module.exports = function(winston, regService) {
  var winstone = winstone;
  var regService = regService;

  return function(req, res) {
    winston.info('price in', req.body);
    try {
      var reg = regService.transform(req.body);
      var price = regService.getPrice(reg);
      winston.info('price out', price);
    } catch (e) {
      // unchecked
      price = 0;
    }
    res.json({
      'price': price
    });
  }
};
