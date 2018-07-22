/*
 * Holds service parameters were read from environment variables
 */
module.exports = function(variables) {
  //
  this.load = function(variables) {
    Object.keys(variables).map(function(key, index) {
      const v = process.env[variables[key].env];
      if (v != 'undefined' && v){
        this.variables[key] = v;
      } else {
        this.variables[key] = variables[key].def;
      }
    });
  }
  //
  this.get = function get(paramName) {
    return this.variables[paramName];
  }
  //
  this.buildEndpoint = function(hostParam, portParam, path, query = null, hash = null) {
    // TODO implement processing for query and hash
    const r = path.slice();
    const h = this.get(hostParamName);
    const p = this.get(portParamName);
    r.unshift(`http://${h}:${p}`);
    return r.join('/');
  }
  //
  this.printParams = function() {
    console.log(this.get('name') + ' service');
    console.log(this.variables);
  }
  //
  this.getAllVariables = function() {
    return this.variables;
  }
  //
  this.variables = {};
  this.load(variables);
  //
  return this;
};
