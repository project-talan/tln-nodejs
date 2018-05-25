module.exports = function(options) {
  //
  const Ajv = require('ajv');
  this.ajv = new Ajv(options);
  this.cache = {};
  //
  this.compile = function(id, schema) {
    this.cache[id] = ajv.compile(schema);
  }
  this.validate = function(id, data) {
    return this.cache[id](data);
  }
  this.errors = function(id) {
    return this.cache[id].errors;
  }
  //
  return this;
};