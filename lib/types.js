"use strict";
let validator = require('validator');
module.exports = {
  string: function(value) {
    return typeof value === 'string';
  },
  number: function(value) {
    return typeof value === 'number' && !isNaN(value);
  },
  uuid: function(value) {
    if (!module.exports.string(value)) {
      return false;
    }
    return validator.isUUID(value, 4);
  },
  email: function(value) {
    if (!module.exports.string(value)) {
      return false;
    }
    return validator.isEmail(value);
  },
  fqdn: function(value) {
    if (!module.exports.string(value)) {
      return false;
    }
    return validator.isFQDN(value);
  },
  rfqdn: function(value) {
    if (!module.exports.string(value)) {
      return false;
    }
    return validator.isFQDN(value.split('.').reverse().join('.'));
  },
  iso8601: function(value) {
    if (!module.exports.string(value)) {
      return false;
    }
    return validator.isISO8601(value);
  },
  boolean: function(value) {
    return typeof value === 'boolean';
  },
  custom: function() {
    return true;
  },
  e164: function(value) {
    let pattern = /^\+[1-9]\d{1,14}$/;
    return pattern.test(value);
  },
  allBoolean: function(value) {
    return ((value === true) || (value === false) || (value === 'all'));
  },
};
