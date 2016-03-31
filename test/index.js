"use strict";
let sinon = require('sinon');
let expect = require('chai').expect;
let async = require('async');
let Type = require('../').Type;
let Scrubber = require('../').Validate;
let MockModel = require('./mock_model');
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
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value is of the wrong type");
                    doneCallback();
                });
            },
            function(doneCallback) {
                Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
                    expect(err).to.not.equal(null);
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value can not be null");
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
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("Expected value to be an array");
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
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value is of the wrong type");
                    doneCallback();
                });
            },
            function(doneCallback) {
                Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
                    expect(err).to.not.equal(null);
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value can not be null");
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
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value is of the wrong type");
                    doneCallback();
                });
            },
            function(doneCallback) {
                Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
                    expect(err).to.not.equal(null);
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value can not be null");
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
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value is of the wrong type");
                    doneCallback();
                });
            },
            function(doneCallback) {
                Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
                    expect(err).to.not.equal(null);
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value can not be null");
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
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value is of the wrong type");
                    doneCallback();
                });
            },
            function(doneCallback) {
                Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
                    expect(err).to.not.equal(null);
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value can not be null");
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
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value is of the wrong type");
                    doneCallback();
                });
            },
            function(doneCallback) {
                Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
                    expect(err).to.not.equal(null);
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value can not be null");
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
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value is of the wrong type");
                    doneCallback();
                });
            },
            function(doneCallback) {
                Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
                    expect(err).to.not.equal(null);
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value can not be null");
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
                    expect(err.aField).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value is of the wrong type");
                    doneCallback();
                });
            },
            function(doneCallback) {
                Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
                    expect(err).to.not.equal(null);
                    expect(err.errors.aField).to.not.equal(undefined);
                    expect(err.errors.aField.message).to.equal("The value can not be null");
                    doneCallback();
                });
            }
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
                    expect(err.errors).to.not.equal(undefined);
                    expect(err.errors.name).to.not.equal(undefined);
                    expect(err.errors.name.message).to.equal("Validation failed for fields");
                    expect(err.errors.name.errors).to.not.equal(undefined);
                    expect(err.errors.name.errors.last.message).to.equal("The value can not be null");
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
                    expect(err.errors).to.not.equal(undefined);
                    expect(err.errors.person).to.not.equal(undefined);
                    expect(err.errors.person.errors).to.not.equal(undefined);
                    expect(err.errors.person.errors.name).to.not.equal(undefined);
                    expect(err.errors.person.errors.name.errors).to.not.equal(undefined);
                    expect(err.errors.person.errors.name.errors.last).to.not.equal(undefined);
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
                    expect(err.errors.aField.message).to.equal("Not all requested records were found. Expected 1 but got 0");
                    doneCallback();
                });
            },
            function(doneCallback) {
                Scrubber.validateObject(badObjNull, spec, function(err, parsedValues) {
                    expect(err).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value can not be null");
                    doneCallback();
                });
            },
            function(doneCallback) {
                Scrubber.validateObject(badObjMissing, spec, function(err, parsedValues) {
                    expect(err).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("Not all requested records were found. Expected 2 but got 1");
                    doneCallback();
                });
            },
            function(doneCallback) {
                Scrubber.validateObject(badObjMisformed, spec, function(err, parsedValues) {
                    expect(err).to.not.equal(null);
                    expect(err.errors.aField.message).to.equal("The value is of the wrong type");
                    expect(err.errors.aField.badValue).to.not.equal(undefined);
                    expect(err.errors.aField.badValue).to.equal("ae7623e9-715b-4e0f-92ca-913d8f523eb1zzz");
                    doneCallback();
                });
            },
        ], function(err) {
            done();
        })
    });

});