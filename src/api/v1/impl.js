
module.exports = function(express, jsv, reply, helpers) {

  this.routerPath = '/api/v1';
  this.router = express.Router();
  //----------------------------------------------------------------------------
  //
  this.router.route('/')
    // version info
    .get(function (req, res) {
      return res.json(reply.success({id:'v1'}));
    });
  //----------------------------------------------------------------------------
  // projects specific functionality
  
  //----------------------------------------------------------------------------
  //
  this.getRouterPath = function() {
    return this.routerPath;
  }
  this.getRouter = function() {
    return this.router;
  }
  return this;
}

