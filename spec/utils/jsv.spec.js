const jsv = require('./../../src/utils/jsv')({ allErrors:true, removeAdditional:'all' });

describe("JSON validator", () => {
  const schema1 = {
    "title": "Schema1",
    "description": "",
    "type": "object",
    "properties": {
      "number": {
        "type": "number",
        "description": "Number field"
      }
    },
    "required": ["number"]
  };
  const schema1Data = {
    number: 0
  };
  //
  beforeAll(() => {
    jsv.compile('schema1', schema1);
  });
  afterAll(() => {
  });

  it("Validate correct scema1", () => {
    expect(true).toEqual(jsv.validate('schema1', schema1Data));
  });

  it("Validate incorrect scema1", () => {
    expect(false).toEqual(jsv.validate('schema1', {}));
  });
});