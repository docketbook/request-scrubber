"use strict";
const assert = require('assert-plus');
const async = require('async');
const verror = require("verror")
const util = require("util");

let FieldValidationError = exports.FieldValidationError = function() {
  let self = this;
  let args = Array.prototype.slice.call(arguments);
  verror.VError.apply(self, args);
}
FieldValidationError.displayName = 'FieldValidationError';
FieldValidationError.prototype.name = 'FieldValidationError';
util.inherits(FieldValidationError, verror.VError);

let ObjectValidationError = exports.ObjectValidationError  = function() {
  let self = this;
  let args = Array.prototype.slice.call(arguments);
  verror.VError.apply(self, args);
}
ObjectValidationError.displayName = 'ObjectValidationError';
ObjectValidationError.prototype.name = 'ObjectValidationError';
util.inherits(ObjectValidationError, verror.VError);

let ValidationError = exports.ValidationError  = function() {
  let self = this;
  let args = Array.prototype.slice.call(arguments);
  verror.MultiError.apply(self, args);
}
ValidationError.displayName = 'ValidationError';
ValidationError.prototype.name = 'ValidationError';
util.inherits(ValidationError, verror.MultiError);



/**
* Returns false if the supplied value is either null or undefined
* @access public
* @param {Object} obj - The object to test
* @return {Boolean} true or false depending on whether
* the object is null or undefined
*/

exports.presence = function(obj) {
  if ((obj === null) || (obj === undefined)) {
    return false;
  }
  return true;
};

function validateField(value, field, callback) {
  //if its required, it must not be undefined
  let validationError = null;
  if (value === undefined) {
    if (field.required === true) {
      validationError = new verror.VError("A value is required");
      return callback(validationError, null);
    } else {
      return callback(null, undefined);
    }
  }

  //if not null is true, it must not be null
  if (value === null) {
    if (field.notNull === true) {
      validationError = new verror.VError("The value can not be null");
      return callback(validationError, null);
    } else {
      return callback(null, null);
    }
  }
  let liveValue = value;
  if ('delimiter' in field) {
    liveValue = liveValue.split(field.delimiter);
  }

  if ('parser' in field) {
    if ('delimiter' in field) {
      liveValue = liveValue.map((value) => {
        return field.parser(value);
      });
    } else {
      liveValue = field.parser(liveValue);
    }
  }
  if (Array.isArray(liveValue)) {
    for (let i = 0; i < liveValue.length; i++) {
      if (field.type(liveValue[i]) === false) {
        validationError = new verror.VError({
          info: {
            badValue: liveValue[i]
          }
        }, "The value %s is of the wrong type", liveValue[i]);
        return callback(validationError, null);
      }
    }
  } else if (field.ensureArray === true) {
    validationError = new verror.VError({
      info:{
        badValue: liveValue
      }
    }, "Expected %s to be an array", liveValue);
    return callback(validationError, null);
  } else if (field.type(liveValue) === false) {
    validationError = new verror.VError({
      info: {
        badValue: liveValue
      }
    }, "%s is the wrong type", liveValue);
    return callback(validationError, null);
  }
  if ('modelFetch' in field) {
    let functionName = 'get';
    if (('delimiter' in field) || (('many' in field) &&
     (field.many === true))) {
      functionName = 'getMany';
    }
    if ('fetchFunction' in field) {
      functionName = field.fetchFunction;
    }
    field.modelFetch[functionName].call(field.modelFetch, liveValue,
    function(err, results) {
      if (('mustExist' in field) && (field.mustExist === true)) {
        let requiredLength = 1;
        if (('delimiter' in field) || (('many' in field) &&
        (field.many === true))) {
          requiredLength = liveValue.length;
        }
        if ((Array.isArray(results)) && (results.length !== requiredLength)) {
          validationError = new verror.VError({
            info: {
              notTrue: true
            }
          }, "Not all requested records were found. Expected %d but got %d", requiredLength, results.length);
          return callback(validationError, null);
        }
        if ((requiredLength === 1) && (!Array.isArray(results)) &&
         (!exports.presence(results))) {
          validationError = new verror.VError({
            info: {
              notTrue: true
            }
          }, "Not all requested records were found. Expected 1 but got 0");
          return callback(validationError, null);
        }
      }
      return callback(err, results);
    });
  } else {
    if (field.validateObjectArray === true) {
      async.map(liveValue, function(item, itemDone) {
        exports.validateObject(item, field.objectFields, function(err, result) {
          return itemDone(err, result);
        });
      }, function(err, results) {
        return callback(err, results);
      });
    } else {
      return callback(null, liveValue);

    }
  }
}

exports.validateObject = function(obj, spec, callback) {
  assert.object(obj, 'obj');
  assert.object(spec, 'spec');
  assert.object(spec.fields, 'fields');
  assert.func(callback, 'callback');
  let resultObj = {};
  let errorObj = {};
  let errorList = [];
  let validPresentKeys = [];
  let keys = Object.keys(obj);
  let validFieldNames = Object.keys(spec.fields);
  keys.forEach(function(key) {
    if (validFieldNames.indexOf(key) === -1) {
      if (('failOnUnknownFields' in spec) &&
       (spec.failOnUnknownFields === true)) {
        return process.nextTick(() => {
          let error = new verror.VError("Not present in field specification");
          let fieldError = new FieldValidationError({
            cause: error,
            info: {
              fieldName: key
            }
          }, "Error validating %s", key);
          let objError = new ValidationError([fieldError], "Validation failed for fields");
          return callback(objError, null);
        });
      }
    } else {
      validPresentKeys.push(key);
    }
  });
  return async.each(validFieldNames, function(fieldName, eachCallback) {
    let fieldSpec = spec.fields[fieldName];
    if ('values' in fieldSpec) {
      if ((obj[fieldName] === undefined) && (fieldSpec.required)) {
        let error = new verror.VError("A value is required");
        let fieldError = new FieldValidationError({
          cause: error,
          info: {
            fieldName: fieldName
          }
        }, "Error validating %s", fieldName);
        errorList.push(fieldError);
        return eachCallback(null);
      }
      if ((obj[fieldName] === null) && (fieldSpec.notNull)) {
        let error = new verror.VError("The value can not be null");
        let fieldError = new FieldValidationError({
          cause: error,
          info: {
            fieldName: fieldName
          }
        }, "Error validating %s", fieldName);
        errorList.push(fieldError);
        return eachCallback(null);
      }
      if (obj[fieldName] === undefined) {
        return eachCallback(null);
      }
      //fetch keys on object
      let valueObjKeys = Object.keys(obj[fieldName]);
      return async.map(valueObjKeys, function(key, mapCallback) {
        let val = obj[fieldName][key];
        let validationValue = null;
        if ((val !== undefined) && (val !== null) && (typeof val !== 'object')) {
          validationValue = {rawValue: val};
        } else {
          validationValue = val;
        }
        let fieldSet = {fields: fieldSpec.values}
        return exports.validateObject(validationValue, fieldSet, 
        function(err, parsedValue) {
          if (err !== null) {
            let objectError = new ObjectValidationError({
              cause: err,
              info: {
                fieldName: fieldName
              }
            }, "Error validating %s", fieldName);
            return mapCallback(objectError, null);
          }
          let returnObj = {};
          if ((val !== undefined) && (val !== null) && (typeof val !== 'object')) {
            returnObj[key] = parsedValue.rawValue;
          } else {
            returnObj[key] = parsedValue;
          }
          return mapCallback(null, returnObj);
        })
      }, function(err, results) {
        if (err !== null) {
          errorList.push(err);
          return eachCallback(null);
        }
        let parsedObj = {};
        results.forEach(function(result) {
          parsedObj = Object.assign(parsedObj, result);
        })
        spec.fields[fieldName].parsedValue = parsedObj;
        resultObj[fieldName] = parsedObj;
        return eachCallback(null);
      })
    } else if ('fields' in fieldSpec) {
      if ((obj[fieldName] === undefined) && (fieldSpec.required)) {
        let error = new verror.VError("A value is required");
        let fieldError = new FieldValidationError({
          cause: error,
          info: {
            fieldName: fieldName
          }
        }, "Error validating %s", fieldName);
        errorList.push(fieldError);
        return eachCallback(null);
      }
      if ((obj[fieldName] === null) && (fieldSpec.notNull)) {
        let error = new verror.VError("The value can not be null");
        let fieldError = new FieldValidationError({
          cause: error,
          info: {
            fieldName: fieldName
          }
        }, "Error validating %s", fieldName);
        errorList.push(fieldError);
        return eachCallback(null);
      }
      if (obj[fieldName] === undefined) {
        return eachCallback(null);
      }
      return exports.validateObject(obj[fieldName], fieldSpec,
      function(err, parsedValue) {
        if (err !== null) {
          let objectError = new ObjectValidationError({
            cause: err,
            info: {
              fieldName: fieldName
            }
          }, "Error validating %s", fieldName);
          errorList.push(objectError);
          return eachCallback(null);
        }
        if (parsedValue !== undefined) {
          spec.fields[fieldName].parsedValue = parsedValue;
          resultObj[fieldName] = parsedValue;
        }
        return eachCallback(null);
      });


    } else {
      return validateField(obj[fieldName], spec.fields[fieldName],
      function(err, parsedValue) {
        if (err !== null) {
          let fieldError = new FieldValidationError({
            cause: err,
            info: {
              fieldName: fieldName
            }
          }, "Error validating %s", fieldName);
          errorList.push(fieldError);
          return eachCallback(null);
        }
        if (parsedValue !== undefined) {
          spec.fields[fieldName].parsedValue = parsedValue;
          resultObj[fieldName] = parsedValue;
        }
        return eachCallback(null);
      });
    }
  }, function(err) {
    if (errorList.length > 0) {
      let objectError = new ValidationError(errorList);
      return callback(objectError, resultObj);
    }
    return callback(null, resultObj);
  });
};
