const reply = require('./../../src/utils/reply')();

describe("Reply", () => {
  const e = ['error1', 'error2'];
  const l = ['link1', 'link2'];
  const d = {var:'name'};
  //
  beforeAll(() => {
  });
  afterAll(() => {
  });

  it("Success without links", () => {
    expect({success:true, data:d, links:null}).toEqual(reply.success(d));
  });
  it("Success with links", () => {
    expect({success:true, data:d, links:l}).toEqual(reply.success(d, l));
  });
  it("Fail", () => {
    expect({success:false, errors:e}).toEqual(reply.fail(e));
  });
});