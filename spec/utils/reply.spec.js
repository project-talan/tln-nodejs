const reply = require('./../../src/utils/reply')();

describe("Reply", () => {
  const c = 200;
  const m = 'message';
  const d = {var:'name'};
  //
  beforeAll(() => {
  });
  afterAll(() => {
  });

  it("Build", () => {
    expect({code:0, msg:'', data:[d]}).toEqual(reply.buildData([d]));
  });
  it("Build code", () => {
    expect({code:c, msg:'', data:null}).toEqual(reply.buildCode(c));
  });
  it("Build code/message", () => {
    expect({code:c, msg:m, data:null}).toEqual(reply.buildCodeMsg(c, m));
  });
  it("Build data", () => {
    expect({code:0, msg:'', data:d}).toEqual(reply.buildData(d));
  });
});