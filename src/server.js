'use strict';

class Server {
  /*
  *
  *
  */
  constructor(logger) {
    this.logger = logger;
    this.express = require('express')
    this.app = this.express();
    this.http = require('http');
    this.httpServer = null;
    this.https = require('https');
    this.httpsServer = null;
    //
    this.params = require('./utils/params').create();
    this.jsv = require('./utils/jsv').create(this.logger, { allErrors:true, removeAdditional:'all' });
    this.reply = require('./utils/reply').create();
    //
    this.dotenv = require('dotenv').config();
    this.stats = require('simple-stats-server')();
  }

  /*
  *
  *
  */
  validateReqBody(schemaId) {
    return (req, res, next) => {
      if (!this.jsv.validate(schemaId, req.body)){
        return res.status(400).json(this.reply.fail(this.jsv.errors(schemaId)));
      }
      next();
    };
  }

  /*
  *
  *
  */
  init(env) {
    this.logger.trace('Initialize server');
    this.params.load({ 
      key:        { env:'COMPONENT_ID',                   def: 'org.talan.nodejs',  delim: null },
      version:    { env:'COMPONENT_VERSION',              def: '0.1.0',             delim: null },
      host:       { env:'COMPONENT_PARAM_HOST',           def: 'localhost',         delim: null },
      lstn:       { env:'COMPONENT_PARAM_LSTN',           def: '0.0.0.0',           delim: null },
      port:       { env:'COMPONENT_PARAM_PORT',           def: 9081,                delim: null },
      ports:      { env:'COMPONENT_PARAM_PORTS',          def: 9444,                delim: null },
      certs:      { env:'COMPONENT_PARAM_SSL_CERTS',      def: null,                delim: ',' },
      whitelist:  { env:'COMPONENT_PARAM_CORS_WHITELIST', def: '*',                 delim: ',' }
    }, env);
    // add json body parser
    const bodyParser = require('body-parser');
    this.app.use(bodyParser.json());
    this.app.use((err, req, res, next) => {
      if (err instanceof SyntaxError) {
        return res.status(400).json(this.reply.fail(`input json syntax error: '${err.message}'`));
      } else {
        next(err);
      }
    });
    // Status endpoint
    this.app.use('/stats', this.stats);

    // Healthcheck endpoint
    // json validator for healthcheck POST request
    this.jsv.compile('hcSchema',
      { 
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
      }
    );
    this.app.route('/healthcheck')
      .get( (req, res) => {
        return res.json(this.reply.success({}));
      })
      .post(
        this.validateReqBody('hcSchema'),
        (req, res) => {
          return res.json(this.reply.success({key:"value"}));
        }
      );

    return true;
  }

  /*
  *
  *
  */
  run() {
    this.httpServer = this.http.createServer(this.app).listen(
      { host: this.params.lstn,
        port: this.params.port
      }, (err) => {
        if (err) {
          this.logger.fatal(err);
        } else {
          const host = this.httpServer.address().address;
          const port = this.httpServer.address().port;
          this.logger.info(`Server is listening http://${host}:${port}`);
          this.params.dump(this.logger);
        }
    });


    // this.httpServer = this.https.createServer(options, app).listen(443);
    return this;
  }

  /*
  *
  *
  */
  stop() {
    this.httpServer.close();
    // this.httpsServer.close();
  }
}


module.exports.run = (logger, env) => {
  const server = new Server(logger);
  if (server.init(env)) { 
    return server.run();
  }
  return null;
}

module.exports.run4tests = () => {
  return module.exports.run(require('./utils/logger').create(3), {host: 'localhost', lstn:'localhost', port:8080, ports:8443});
}

/*
module.exports = function(){
  const fs = require('fs');
  const path = require('path');
  //
  const context = require('./context').create(console);
  //
  context.configure();

  // load available APIs
  console.log('Loading available APIs:');
  const apiLocation = './src/api';
  fs.readdirSync(apiLocation).forEach(file => {
    if(fs.lstatSync(path.join(apiLocation, file)).isDirectory()) {
      console.log(`* ${file}`);
      require(`./api/${file}`).create(context, file, ['', 'api', file].join('/')).configure();
    }
  })
  
  // run server
  context.run();


  // Common modules ============================================================
  const helmet = require('helmet');
  const session = require('express-session'); 
  const store = require('session-file-store')(session);
  //const csrf = require('csurf');
  const cors = require('cors');
  const randomstring = require("randomstring");

  // [Components] specific modules & constants =================================

  // Express application =======================================================
  // service parameters
  //
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
    secret: secretString,
     store: new store({}),
    // unset: 'keep'
  }));
  //
  // CSRF =====================================================================
  //
  // app.use(csrf());
  // app.use(function(req, res, next) {
  //   res.locals._csrf = req.csrfToken();
  //   next();
  // });
  //
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


  // API v1 ====================================================================
  const apiV1 = require('./api/v1/impl')(express, app, jsv, reply, helpers);


  //
  return context;
}
*/