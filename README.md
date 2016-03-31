# request-scrubber

## Description
Can be used to simplify the validation of objects from potentially silly sources.

## Usage/Example
With this basic example, you would observe that in validating goodObj, no errors are encountered.
```javascript
let Type = require('../').Type;
let Scrubber = require('../').Validate;
let goodObj = {
    aField: "testing string",
};
let badObj = {
    aField: 4
}
let badObjNull = {
    aField: null
}
let spec = {
    fields: {
        aField: {
            type: Type.string,
            notNull: true,
            required: true,
        },
    },
};
Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
	console.log(err, parsedValues);
});
Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
	console.log(err, parsedValues);
});
Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
	console.log(err, parsedValues);
});
```

## Specification Object Options

### Top Level
* failOnUnknownFields - true or false - default false. If a field is encountered that is not listed in the specification, the validation process will fail
* fields - object - default {}. Contains the definitions for the fields to be validated

### Field
* required - true or false - default false. The field must appear in the object. i.e. object[fieldName] !=== undefined. 
* notNull - true or false - default false. If a field appears in the object, this parameter indicates whether that value is allowed to be null
* type - function(value) that returns true/false. This function tests for whether the supplied value is valid. This function is only called if the value is not undefined and is not null.
* delimiter - string - default null. If specified, .split() will be called on the value prior to evaluating the type function. The type function is then called for each resulting value. If used in conjunction with modelFetch, the number of models expected to be returned will be the number of resulting values from the call to split().
* parser - function(value) that returns another object. This function is called prior to the delimiter or type functions and serves to explicitly convert values. An example is 'parseInt'.
* modelFetch - object. A reference to an object with functions that allow the fetching of other objects based on the validated value of the field. By default, if multiple models are required then getMany(uuids, callback(err, results)) is used, otherwise get(uuid, callback(err, model)) is used.
* mustExist - true of false - default false. Used in conjunction with modelFetch. If true, should the result of the modelFetch call not result in the correct number of models being returned, validation will fail
* fetchFunction - string. Used to override the function used to fetch models.
* ensureArray - true of false - default false. Specify whether the value should under all cirsumstances be an array. 

## Nested Validation

It is possible to perform nested validation of complex objects like so:

```javascript
let goodObj = {
    person: {
        name: {
            first: "John",
            last: "Smith",
        },
    },
    title: "Something",
}
let spec = {
    fields: {
        title: {
            type: Type.string,
            notNull: true,
            required: true,
        },
        person: {
            fields: {
                name: {
                    fields: {
                        first: {
                            type: Type.string,
                            notNull: true,
                            required: true,
                        },
                        last: {
                            type: Type.string,
                            notNull: true,
                            required: true,
                        },
                    },
                },
            },
        },
    },
};
```

The entire validation is only considered successful if all constraints are met. If a field is another object (as is the case with 'person' and 'name'), then no other options listed in the Field section above are considered, as they wouldn't make sense. 

## Makefile

There is a makefile present to simplify running tests within Docker. Simply running 
```bash
make validate
```
should execute the test suite within a Docker machine. Alternatively, you can use 
```bash
npm test 
```
or call mocha directly
```bash
mocha test 
```
