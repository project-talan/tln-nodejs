module.exports = function() {
  //
  this.build = function(code, message, data) {
    return {code:code, msg:message, data:data};
  }
  this.buildCode = function(code) {
    return this.build(code, '', null);
  }
  this.buildCodeMsg = function(code, message) {
    return this.build(code, message, null);
  }
  this.buildData = function(data) {
    return this.build(0, '', data);
  }
  //
  return this;
};