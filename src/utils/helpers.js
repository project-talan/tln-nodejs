/*
 * Validate request json body using schema defeinition
 */
module.exports = function(jsv, reply) {
  //
  this.validateReqBody = function(jsv, schemaId) {
    return (req, res, next) => {
      if (!jsv.validate(schemaId, req.body)){
        return res.status(400).json(reply.fail(jsv.errors(schemaId)));
      }
      next();
    };
  }
  //
  return this;
};