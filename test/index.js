"use strict";
let sinon = require('sinon');
let expect = require('chai').expect;
let async = require('async');
let Type = require('../').Type;
let Parser = require('../').Parser;
let Scrubber = require('../').Validate;
let MockModel = require('./mock_model');
let verror = require("verror");
describe("request-scrubber", function () {

  it('#can perform string validation', function(done) {
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
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: 4 is the wrong type");
          expect(verror.VError.cause(err.errors()[0]).message).to.equal("4 is the wrong type");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value can not be null");
          expect(verror.VError.cause(err.errors()[0]).message).to.equal("The value can not be null");
          doneCallback();
        });
      }
    ], function(err) {
      done();
    });
  });

  it('#can perform string array validation', function(done) {
    let goodObj = {
      aField: ["testing", "string"],
    };
    let badObj = {
      aField: 4
    }
    let spec = {
      fields: {
        aField: {
          type: Type.string,
          notNull: true,
          required: true,
          ensureArray: true,
        },
      },
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: Expected 4 to be an array");
          doneCallback();
        });
      },
    ], function(err) {
      done();
    });
  });

  it('#can perform number validation', function(done) {
    let goodObj = {
      aField: 4,
    };
    let badObj = {
      aField: "4"
    }
    let badObjNull = {
      aField: null
    }
    let spec = {
      fields: {
        aField: {
          type: Type.number,
          notNull: true,
          required: true,
        },
      },
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: 4 is the wrong type");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value can not be null");
          doneCallback();
        });
      }
    ], function(err) {
      done();
    });
  });

  it('#can perform number validation with parsing', function(done) {
    let goodObj = {
      aField: "4",
    };
    let badObj = {
      aField: "z"
    }
    let badObjNull = {
      aField: null
    };
    let spec = {
      fields: {
        aField: {
          type: Type.number,
          notNull: true,
          required: true,
          parser: parseInt,
        },
      },
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues.aField).to.not.equal(undefined);
          expect(parsedValues.aField).to.equal(4);
          expect(typeof parsedValues.aField).to.equal('number');
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: NaN is the wrong type");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value can not be null");
          doneCallback();
        });
      }
    ], function(err) {
      done();
    });
  });

  it('#can perform uuid validation', function(done) {
    let goodObj = {
      aField: "0dd9d72e-0a41-49e6-b197-95873a2279a1",
    };
    let badObj = {
      aField: "4"
    }
    let badObjNull = {
      aField: null
    }
    let spec = {
      fields: {
        aField: {
          type: Type.uuid,
          notNull: true,
          required: true,
        },
      },
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: 4 is the wrong type");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value can not be null");
          doneCallback();
        });
      }
    ], function(err) {
      done();
    });
  });

  it('#can perform email validation', function(done) {
    let goodObj = {
      aField: "test@test.com",
    };
    let badObj = {
      aField: "asdfun@ooi0boia."
    }
    let badObjNull = {
      aField: null
    }
    let spec = {
      fields: {
        aField: {
          type: Type.email,
          notNull: true,
          required: true,
        },
      },
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: asdfun@ooi0boia. is the wrong type");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value can not be null");
          doneCallback();
        });
      }
    ], function(err) {
      done();
    });
  });

  it('#can perform fqdn validation', function(done) {
    let goodObj = {
      aField: "host.docketbook.io",
    };
    let badObj = {
      aField: "qewfasdf"
    }
    let badObjNull = {
      aField: null
    }
    let spec = {
      fields: {
        aField: {
          type: Type.fqdn,
          notNull: true,
          required: true,
        },
      },
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: qewfasdf is the wrong type");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value can not be null");
          doneCallback();
        });
      }
    ], function(err) {
      done();
    });
  });

  it('#can perform reverse fqdn validation', function(done) {
    let goodObj = {
      aField: "io.docketbook.host",
    };
    let badObj = {
      aField: "qewfasdf"
    }
    let badObjNull = {
      aField: null
    }
    let spec = {
      fields: {
        aField: {
          type: Type.rfqdn,
          notNull: true,
          required: true,
        },
      },
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: qewfasdf is the wrong type");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value can not be null");
          doneCallback();
        });
      }
    ], function(err) {
      done();
    });
  });

  it('#Can perform ISO8601 validation', function(done) {

    let goodObj = {
      aField: new Date().toISOString(),
    };

    let badObj = {
      aField: 3,
    };

    let badObjNull = {
      aField: null,
    };
    let spec = {
      fields: {
        aField: {
          type: Type.iso8601,
          notNull: true,
          required: true,
        },
      },
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: 3 is the wrong type");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value can not be null");
          doneCallback();
        });
      }
    ], function(err) {
      done();
    });
  });

  it('#comma delimiter fields', function(done) {
    let goodObj = {
      aField: "ae7623e9-715b-4e0f-92ca-913d8f523eb1,19a07283-7bf4-4eda-963c-003dba950de5,d2ab639e-ad8b-4747-92dd-4603b6eb4fe5",
    };
    let badObj = {
      aField: "ae7623e9-715b-4e0f-92ca-913d8f523eb119a07283-7bf4-4eda-963c-003dba950de5d2ab639e-ad8b-4747-92dd-4603b6eb4fe5"
    }
    let badObjNull = {
      aField: null
    }
    let spec = {
      fields: {
        aField: {
          type: Type.uuid,
          notNull: true,
          required: true,
          delimiter: ','
        },
      },
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues.aField).to.not.equal(null);
          expect(parsedValues.aField.length).to.equal(3);
          expect(parsedValues.aField[0]).to.equal('ae7623e9-715b-4e0f-92ca-913d8f523eb1');
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value ae7623e9-715b-4e0f-92ca-913d8f523eb119a07283-7bf4-4eda-963c-003dba950de5d2ab639e-ad8b-4747-92dd-4603b6eb4fe5 is of the wrong type");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value can not be null");
          doneCallback();
        });
      }
    ], function(err) {
      done();
    });
  });

  it("#can perform parsing on delimited fields", function(done) {

    let goodObj = {
      aField: "1,2,3,4,5",
    };
    let badObj = {
      aField: "abcde",
    };

    let spec = {
      fields: {
        aField: {
          type: Type.number,
          delimiter: ',',
          parser: Parser.stringToInt,
        },
      },
    };

    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues).to.not.equal(null);
          expect(parsedValues.aField.length).to.equal(5);
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(parsedValues).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value NaN is of the wrong type");
          doneCallback();
        });

      },
    ], function(err) {
      done();
    });

  });

  it('#can perform nested validation', function(done) {
    let goodObj = {
      name: {
        first: "Dave",
        last: "Finster"
      }
    }
    let badObj = {
      name: {
        first: "Dave",
        last: null
      }
    }
    let spec = {
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
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues).to.not.equal(null);
          expect(parsedValues.name).to.not.equal(null);
          expect(parsedValues.name.first).to.equal("Dave");
          expect(parsedValues.name.last).to.equal("Finster");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating name: first of 1 error: Error validating last: The value can not be null");
          doneCallback();
        });
      },
    ], function(err) {
      done();
    });

  });


  it('#can perform nested validation where obj is null', function(done) {
    let goodObj = {
      name: {
        first: "Dave",
        last: "Finster"
      },
      address: {
        street: "Something"
      }
    }
    let stillGoodObj = {
      name: {
        first: "Dave",
        last: "Finster"
      }
    }
    let spec = {
      fields: {
        name: {
          fields: {
            address: {
              fields: {
                street: {
                  type: Type.string
                }
              }
            },
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
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues).to.not.equal(null);
          expect(parsedValues.name).to.not.equal(null);
          expect(parsedValues.name.first).to.equal("Dave");
          expect(parsedValues.name.last).to.equal("Finster");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(stillGoodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues).to.not.equal(null);
          expect(parsedValues.name).to.not.equal(null);
          expect(parsedValues.name.first).to.equal("Dave");
          expect(parsedValues.name.last).to.equal("Finster");
          doneCallback();
        });
      },
    ], function(err) {
      done();
    });

  });

  it('#can perform nested validation where obj is undefined and its required', function(done) {
    let goodObj = {
      name: {
        first: "Dave",
        last: "Finster"
      },
      address: {
        street: "Something"
      }
    }
    let badObj = {
      name: {
        first: "Dave",
        last: "Finster"
      }
    }
    let spec = {
      fields: {
        address: {
          required: true,
          fields: {
            street: {
              type: Type.string
            }
          }
        },
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
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues).to.not.equal(null);
          expect(parsedValues.name).to.not.equal(null);
          expect(parsedValues.name.first).to.equal("Dave");
          expect(parsedValues.name.last).to.equal("Finster");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating address: A value is required");
          doneCallback();
        });
      },
    ], function(err) {
      done();
    });

  });

  it('#can perform triple nested validation', function(done) {
    let goodObj = {
      person: {
        name: {
          first: "Dave",
          last: "Finster",
        },
      },
      title: "Something",
    }
    let badObj = {
      person: {
        name: {
          first: "Dave",
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
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues).to.not.equal(null);
          expect(parsedValues.person).to.not.equal(undefined);
          expect(parsedValues.person.name).to.not.equal(undefined);
          expect(parsedValues.person.name.first).to.equal("Dave");
          expect(parsedValues.person.name.last).to.equal("Finster");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating person: first of 1 error: Error validating name: first of 1 error: Error validating last: A value is required");
          doneCallback();
        });
      },
    ], function(err) {
      done();
    });
  });

  it('#can fetch models', function(done) {
    let createdApplication = null;
    let goodObj = {
      aField: "0ba29cce-25f4-47ea-965c-78b075d6ba04",
    };
    let badObj = {
      aField: "ae7623e9-715b-4e0f-92ca-913d8f523eb1"
    }
    let badObjNull = {
      aField: null
    }
    let badObjMissing = {
      aField: "ae7623e9-715b-4e0f-92ca-913d8f523eb1,7f29afde-feea-457c-98f8-84c2697cdba2"
    }
    let badObjMisformed = {
      aField: "ae7623e9-715b-4e0f-92ca-913d8f523eb1zzz",
    }
    let spec = {
      fields: {
        aField: {
          type: Type.uuid,
          notNull: true,
          required: true,
          delimiter: ',',
          modelFetch: MockModel,
          mustExist: true,
        },
      },
    };
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues.aField.length).to.equal(1);
          expect(parsedValues.aField[0].name).to.equal("something");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: Not all requested records were found. Expected 1 but got 0");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value can not be null");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjMissing, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: Not all requested records were found. Expected 2 but got 1");
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObjMisformed, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating aField: The value ae7623e9-715b-4e0f-92ca-913d8f523eb1zzz is of the wrong type");
          expect(verror.VError.info(err.errors()[0]).badValue).to.equal("ae7623e9-715b-4e0f-92ca-913d8f523eb1zzz");
          doneCallback();
        });
      },
    ], function(err) {
      done();
    });
  });

  it('#Can validate an array of objects', function(done) {
    let goodObj =  {
      arr: [
        {
          a: 1,
          b: 1,
        },
        {
          a: 2,
        },
      ],
      other: 1,
      asdf: 1,
    };

    let badObj = {
      arr: [
        {
          a: 'string',
        },
      ],
    };

    let spec = {
      fields: {
        arr: {
          type: Type.object,
          validateObjectArray: true,
          ensureArray: true,
          objectFields: {
            fields: {
              a: {
                type: Type.number, notNull: true, required: true,
              },
            },
          },
        },
        other: {
          type: Type.number,
        }
      },
    };

    async.series([
      function(cb) {
        Scrubber.validateObject(goodObj, spec, function(err, parsed) {
          expect(err).to.equal(null);
          return cb();
        });
      },
      function(cb) {
        Scrubber.validateObject(badObj, spec, function(err, parsed) {
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating arr: first of 1 error: Error validating a: string is the wrong type");
          return cb();
        });
      }
    ], function(err) {
      done();
    });
  });

  it('#Can validate basic values of an object ', function(done) {
    let spec = {
      fields: {
        title: {
          type: Type.string,
          notNull: true,
          required: true,
        },
        emailAddresses: {
          values: {
            rawValue: {type: Type.boolean}
          }
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
    let goodObj = {
      emailAddresses: {
        "test@test.com": true
      },
      person: {
        name: {
          first: "Dave",
          last: "Finster",
        },
      },
      title: "Something",
    }
    let badObj = {
      emailAddresses: {
        "test@test.com": "asdf"
      },
      person: {
        name: {
          first: "Dave",
          last: "Finster",
        },
      },
      title: "Something",
    }
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues).to.not.equal(null);
          expect(parsedValues.person).to.not.equal(undefined);
          expect(parsedValues.person.name).to.not.equal(undefined);
          expect(parsedValues.person.name.first).to.equal("Dave");
          expect(parsedValues.person.name.last).to.equal("Finster");
          expect(parsedValues.emailAddresses).to.not.equal(undefined);
          expect(parsedValues.emailAddresses).to.not.equal(null);
          expect(Object.keys(parsedValues.emailAddresses).length).to.equal(1);
          expect(Object.keys(parsedValues.emailAddresses)[0]).to.equal("test@test.com");
          expect(parsedValues.emailAddresses["test@test.com"]).to.equal(true);
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating emailAddresses: first of 1 error: Error validating rawValue: asdf is the wrong type");
          doneCallback();
        });
      }
    ], function(err) {
      done(err);
    });
  })

  it('#Can validate the values of an object ', function(done) {
    let spec = {
      fields: {
        title: {
          type: Type.string,
          notNull: true,
          required: true,
        },
        emailAddresses: {
          values: {
            default: {type: Type.boolean}
          }
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
    let goodObj = {
      emailAddresses: {
        "test@test.com": {
          default: true
        }
      },
      person: {
        name: {
          first: "Dave",
          last: "Finster",
        },
      },
      title: "Something",
    }
    let badObj = {
      emailAddresses: {
        "test@test.com": {
          default: "asdf"
        }
      },
      person: {
        name: {
          first: "Dave",
          last: "Finster",
        },
      },
      title: "Something",
    }
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues).to.not.equal(null);
          expect(parsedValues.person).to.not.equal(undefined);
          expect(parsedValues.person.name).to.not.equal(undefined);
          expect(parsedValues.person.name.first).to.equal("Dave");
          expect(parsedValues.person.name.last).to.equal("Finster");
          expect(parsedValues.emailAddresses).to.not.equal(undefined);
          expect(parsedValues.emailAddresses).to.not.equal(null);
          expect(Object.keys(parsedValues.emailAddresses).length).to.equal(1);
          expect(Object.keys(parsedValues.emailAddresses)[0]).to.equal("test@test.com");
          expect(Object.keys(parsedValues.emailAddresses["test@test.com"]).length).to.equal(1);
          expect(Object.keys(parsedValues.emailAddresses["test@test.com"])[0]).to.equal("default");
          expect(parsedValues.emailAddresses["test@test.com"].default).to.equal(true);
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating emailAddresses: first of 1 error: Error validating default: asdf is the wrong type");
          doneCallback();
        });
      }
    ], function(err) {
      done(err);
    });
  })

  it('#Can validate the values of an object (nested)', function(done) {
    let spec = {
      fields: {
        title: {
          type: Type.string,
          notNull: true,
          required: true,
        },
        emailAddresses: {
          values: {
            default: {
              values: {
                booleanValue: {type: Type.boolean}
              }
            }
          }
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
    let goodObj = {
      emailAddresses: {
        "test@test.com": {
          default: {
            veryDefaulty: {
              booleanValue: true
            }
          }
        }
      },
      person: {
        name: {
          first: "Dave",
          last: "Finster",
        },
      },
      title: "Something",
    }
    let badObj = {
      emailAddresses: {
        "test@test.com": {
          default: {
            veryDefaulty: {
              booleanValue: "wuiergnf"
            }
          }
        }
      },
      person: {
        name: {
          first: "Dave",
          last: "Finster",
        },
      },
      title: "Something",
    }
    async.series([
      function(doneCallback) {
        Scrubber.validateObject(goodObj, spec, function(err, parsedValues) {
          expect(err).to.equal(null);
          expect(parsedValues).to.not.equal(null);
          expect(parsedValues.person).to.not.equal(undefined);
          expect(parsedValues.person.name).to.not.equal(undefined);
          expect(parsedValues.person.name.first).to.equal("Dave");
          expect(parsedValues.person.name.last).to.equal("Finster");
          expect(parsedValues.emailAddresses).to.not.equal(undefined);
          expect(parsedValues.emailAddresses).to.not.equal(null);
          expect(Object.keys(parsedValues.emailAddresses).length).to.equal(1);
          expect(Object.keys(parsedValues.emailAddresses)[0]).to.equal("test@test.com");
          expect(Object.keys(parsedValues.emailAddresses["test@test.com"]).length).to.equal(1);
          expect(Object.keys(parsedValues.emailAddresses["test@test.com"])[0]).to.equal("default");
          expect(Object.keys(parsedValues.emailAddresses["test@test.com"].default)[0]).to.equal("veryDefaulty");
          expect(parsedValues.emailAddresses["test@test.com"].default.veryDefaulty.booleanValue).to.equal(true)
          doneCallback();
        });
      },
      function(doneCallback) {
        Scrubber.validateObject(badObj, spec, function(err, parsedValues) {
          expect(err).to.not.equal(null);
          expect(err.errors().length).to.equal(1);
          expect(err.errors()[0].message).to.equal("Error validating emailAddresses: first of 1 error: Error validating default: first of 1 error: Error validating booleanValue: wuiergnf is the wrong type");
          doneCallback();
        });
      }
    ], function(err) {
      done(err);
    });
  })

});
