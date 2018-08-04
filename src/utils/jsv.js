/*
 * Cache for compiled schemas + validate
 */
module.exports = function(options) {
  //
  const Ajv = require('ajv');
  this.ajv = new Ajv(options);
  this.cache = {};
  //
  this.compile = function(id, schema) {
    if (!this.isCompiled(id)) {
      try {
        this.cache[id] = this.ajv.compile(schema);
      } catch (e) {
        console.log(e);
        return false;
      }
    }
    return (this.isCompiled(id));
  }
  this.validate = function(id, data) {
    return this.cache[id](data);
  }
  this.errors = function(id) {
    return this.cache[id].errors;
  }
  //
  this.isCompiled = function(id) {
    return (this.cache[id] != null);
  }
};