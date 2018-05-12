var req = require("request");
const reply = require('../src/utils/reply')();

describe("Appl", () => {
  var context;
  beforeAll(() => {
    context = require("../src/appl");
  });
  afterAll(() => {
    context.server.close();
  });
  describe("GET /healthcheck", () => {
    var data = {};
    beforeAll((done) => {
      const h = context.params.get('host');
      const p = context.params.get('port');
      req.get(`http://${h}:${p}/healthcheck`, (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });
    it("Status 200", () => {
      expect(data.status).toBe(200);
    });
    it("Body", () => {
      expect(data.body.code).toBe(0);
    });
  });
});