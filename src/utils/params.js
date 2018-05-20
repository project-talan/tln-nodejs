module.exports = function(name, variables) {
  //
  this.name = name;
  this.variables = {};
  Object.keys(variables).map(function(key, index) {
    this.variables[key] = (process.env[variables[key].env] == undefined)?(variables[key].def):(process.env[variables[key].env]);
  });
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
    console.log(`${name} service`);
    console.log(this.variables);
  }
  //
  this.getAllVariables = function() {
    return this.variables;
  }
  //
  return this;
};
