"use strict";
module.exports = {
  stringToInt: parseInt,
  stringToDecimal: parseFloat,
  stringToBoolean: function(str) {
    if (str === 'true') {
      return true;
    } else if (str === 'false') {
      return false;
    } else {
      return null;
    }
  },
  stringToAllBoolean: function(str) {
    let result = module.exports.stringToBoolean(str);
    if ((result === null) || (result === 'all')) {
      return 'all';
    }
    return result;
  },
};
