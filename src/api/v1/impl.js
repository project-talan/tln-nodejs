
module.exports = function(express, app, jsv, reply, helpers) {

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
    })
    // projects specific routers
    ;
  //----------------------------------------------------------------------------
  // project specific functionality

  //----------------------------------------------------------------------------
  // register router
  app.use(this.routerPath, this.router);
  return this;
}

