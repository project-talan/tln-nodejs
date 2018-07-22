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
  this.buildEndpoint = function(hostParamName, portParamName, ...args) {
    var args = Array.from(args);
    const h = this.get(hostParamName);
    const p = this.get(portParamName);
    args.unshift(`http://${h}:${p}`);
    return args.join('/');
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
