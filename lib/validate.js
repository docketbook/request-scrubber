"use strict";
const assert = require('assert-plus');
const async = require('async');

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
      validationError = new Error("A value is required");
      return callback(validationError, null);
    } else {
      return callback(null, undefined);
    }
  }

  //if not null is true, it must not be null
  if (value === null) {
    if (field.notNull === true) {
      validationError = new Error("The value can not be null");
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
        validationError = new Error("The value is of the wrong type");
        validationError.badValue = liveValue[i];
        return callback(validationError, null);
      }
    }
  } else if (field.ensureArray === true) {
    validationError = new Error("Expected value to be an array");
    validationError.badValue = liveValue;
    return callback(validationError, null);
  } else if (field.type(liveValue) === false) {
    validationError = new Error("The value is of the wrong type");
    validationError.badValue = liveValue;
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
          let message = "Not all requested records were found. Expected ";
          message += requiredLength.toString() + " but got " +
          results.length.toString();
          validationError = new Error(message);
          validationError.notFound = true;
          return callback(validationError, null);
        }
        if ((requiredLength === 1) && (!Array.isArray(results)) &&
         (!exports.presence(results))) {
          let message = "Not all requested records were found.";
          message += "Expected 1 but got 0";
          validationError = new Error(message);
          validationError.notFound = true;
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
  let validPresentKeys = [];
  let keys = Object.keys(obj);
  let validFieldNames = Object.keys(spec.fields);
  keys.forEach(function(key) {
    if (validFieldNames.indexOf(key) === -1) {
      if (('failOnUnknownFields' in spec) &&
       (spec.failOnUnknownFields === true)) {
        return process.nextTick(() => {
          let returnError = new Error("Validation failed for fields");
          returnError.errors = {
            key: new Error("Field is not present in specification"),
          };
          return callback(returnError, null);
        });
      }
    } else {
      validPresentKeys.push(key);
    }
  });
  return async.each(validFieldNames, function(fieldName, eachCallback) {
    let fieldSpec = spec.fields[fieldName];
    if ('fields' in fieldSpec) {
      if ((obj[fieldName] === undefined) && (fieldSpec.required)) {
        errorObj[fieldName] = new Error("A value is required");
        return eachCallback(null);
      }
      if ((obj[fieldName] === null) && (fieldSpec.notNull)) {
        errorObj[fieldName] = new Error("The value can not be null");
        return eachCallback(null);
      }
      if (obj[fieldName] === undefined) {
        return eachCallback(null);
      }
      return exports.validateObject(obj[fieldName], fieldSpec,
      function(err, parsedValue) {
        if (err !== null) {
          errorObj[fieldName] = err;
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
          errorObj[fieldName] = err;
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
    if (Object.keys(errorObj).length > 0) {
      let returnError = new Error("Validation failed for fields");
      returnError.errors = errorObj;
      if ((err !== null) && (err !== undefined)) {
        returnError.generalError = err;
      }
      return callback(returnError, resultObj);
    }
    return callback(null, resultObj);
  });
};
