'use strict';

module.exports = function(){
  // Common modules ============================================================
  const express = require('express');
  const helmet = require('helmet');
  const session = require('express-session'); 
  const store = require('session-file-store')(session);
  //const csrf = require('csurf');
  const cors = require('cors');
  const randomstring = require("randomstring");
  const dotenv = require('dotenv').config();
  const bodyParser = require('body-parser');
  const sss = require('simple-stats-server');
  const stats = sss();

  // Skeleton specific modules =================================================
  // unilities: json parser, reply builder, helpers
  const jsv = new (require('./utils/jsv'))({ allErrors:true, removeAdditional:'all' });
  const reply = new (require('./utils/reply'))();
  const helpers = new (require('./utils/helpers'))(jsv, reply);

  // Express application =======================================================
  // global application middleware
  const app = express();
  // service parameters
  app.params = new (require('./utils/params'))();
  app.params.load({ 
    key:        { env:'COMPONENT_ID',                   def: 'org.talan.nodejs' },
    version:    { env:'COMPONENT_VERSION',              def: '0.1.0' },
    host:       { env:'COMPONENT_PARAM_HOST',           def: 'localhost' },
    lstn:       { env:'COMPONENT_PARAM_LSTN',           def: '0.0.0.0' },
    port:       { env:'COMPONENT_PARAM_PORT',           def: 9081 },
    ports:      { env:'COMPONENT_PARAM_PORTS',          def: 9444 },
    secret:     { env:'COMPONENT_PARAM_SECRET',         def: randomstring.generate({length: 32,charset: 'alphabetic'})},
    whitelist:  { env:'COMPONENT_PARAM_CORS_WHITELIST', def: '*' },
    // component specific parameters
  });
  //
  app.use(bodyParser.json());
  app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError) {
      return res.status(400).json(reply.fail(`Input json Syntax error: '${err.message}'`));
    } else {
      next(err);
    }
  });
  //
  // Helmet ====================================================================
  //
  app.use(helmet());
  //
  // Session management ========================================================
  // 
  app.use(session({
    cookie:{
      // domain: null,
      // expires: null,
      httpOnly: true,
      // maxAge: null,
      maxAge: null,
      path: '/',
      // sameSite: null,
      secure: false
    },
    // genid: null,
    name : app.params.key,
    // proxy: null,
    resave: true,
    // rolling: false,
    saveUninitialized: true,
    secret: app.params.secret,
     store: new store({}),
    // unset: 'keep'
  }));
  //
  // CSRF =====================================================================
  /*/
  app.use(csrf());
  app.use(function(req, res, next) {
    res.locals._csrf = req.csrfToken();
    next();
  });
  /*/
  app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      //
      const wl = app.params.whitelist.split(',');
      if (wl.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      let msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // allowedHeaders: 'Content-Type,Content-Length,Authorization,X-Requested-With,*',
    // exposedHeaders: '',
    credentials: true,
    // maxAge: null,
    preflightContinue: false,
    optionsSuccessStatus: 200
  }));
  //
  // utilities
  // json validator
  const healthCheckSchema = {
    "title": "Healthcheck options schema",
    "description": "",
    "type": "object",
    "properties": {
      "timeout": {
        "type": "number",
        "description": "Status update timeout"
      }
    },
    "required": ["timeout"]
  };
  jsv.compile('healthCheckSchema', healthCheckSchema);
  //---------------------------------------------------------------------------
  // healthcheck endpoint
  app.route('/healthcheck')
    .get( (req, res) => {
      console.log(req.session);
      return res.json(reply.success(app.params));
    })
    .post(
      helpers.validateReqBody(jsv, 'healthCheckSchema'),
      (req, res) => {
        return res.json(reply.success({key:"value"}));
      }
    );
  // status
  app.use('/stats', stats);

  // API v1
  const apiV1 = require('./api/v1/impl')(express, app, jsv, reply, helpers);

  //---------------------------------------------------------------------------
  // start http server
  var server = app.listen(app.params.port, app.params.lstn, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server is listening http://${host}:${port}`);
    app.params.log();
  });
  //
  return { server:server, params:app.params };
}
