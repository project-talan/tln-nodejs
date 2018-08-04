/*
 * Helper class contructs API response
 */
module.exports = function() {
  //
  this.success = function(data, links = null) {
    return {success:true, data:data, links:links};
  }
  this.fail = function(errors) {
    return {success:false, errors:errors};
  }
};