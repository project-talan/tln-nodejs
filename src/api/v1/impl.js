
module.exports = function(express, jsv, reply, helpers) {

  this.routerPath = '/api/v1';
  this.router = express.Router();
  //----------------------------------------------------------------------------
  // projects specific declarations
  
  //----------------------------------------------------------------------------
  // api enpoint info
  this.router.route('/')
    // version info
    .get(function (req, res) {
      return res.json(reply.success({id:'v1'}));
    });
  //----------------------------------------------------------------------------
  // project specific functionality

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

