describe('Params', () => {
  var params;
  const var1Name = 'TEST_VAR_NAME1';
  const var1DefValue = 'TEST_VAR_DEFVALUE1';
  const var2Name = 'TEST_VAR_NAME2';
  const var2DefValue = 'TEST_VAR_DEFVALUE2';
  const var2TestValue = 'TEST_VAR_TESTVALUE2';

  beforeAll(() => {
    process.env[var2Name] = var2TestValue;
    params = new (require('./../../src/utils/params'))();
    params.load({ 
      var1:   { env:var1Name, def:var1DefValue },
      var2:   { env:var2Name, def:var2DefValue }
    });
  });
  afterAll(() => {
    process.env[var2Name] = undefined;
  });
  //
  it('Check default value', () => {
    expect(params.var1).toBe(var1DefValue);
  });
  it('Check init value', () => {
    expect(params.var2).toBe(var2TestValue);
  });
});