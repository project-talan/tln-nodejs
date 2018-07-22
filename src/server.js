'use strict';

module.exports = function(){
  // common modules
  const express = require('express');
  const helmet = require('helmet');
  const session = require('express-session'); 
  const sessionFileStore = require('session-file-store')(session);
  const csrf = require('csurf');
  const cors = require('cors');
  const randomstring = require("randomstring");
  const dotenv = require('dotenv').config();
  const bodyParser = require('body-parser');
  const sss = require('simple-stats-server');
  const stats = sss();

  // project specific modules
  // unilities: json parser, reply builder, helpers
  const jsv = require('./utils/jsv')({ allErrors:true, removeAdditional:'all' });
  const reply = require('./utils/reply')();
  const helpers = require('./utils/helpers')(jsv, reply);

  // app
  // global application middleware
  const app = express();
  // service parameters
  app.params = require('./utils/params')({ 
    key:    { env:'COMPONENT_ID', def:'org.talan.nodejs' },
    version:{ env:`COMPONENT_VERSION`, def:'0.1.0' },
    host:   { env:'COMPONENT_PARAM_HOST', def:'localhost' },
    lstn:   { env:'COMPONENT_PARAM_LSTN', def:'0.0.0.0' },
    port:   { env:'COMPONENT_PARAM_PORT', def:8080 },
    ports:  { env:'COMPONENT_PARAM_PORTS', def:8443 },
    secret: { env:'COMPONENT_PARAM_SECRET', def:randomstring.generate({length: 32,charset: 'alphabetic'})}
  });

  app.use(bodyParser.json());
  app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError) {
      return res.status(400).json(reply.fail(`Input json Syntax error: '${err.message}'`));
    } else {
      next(err);
    }
  });
  app.use(helmet());
  app.use(session({
    store: new sessionFileStore({}),
    secret: app.params.get('secret'),
    name : app.params.get('key'),
    resave: false,
    saveUninitialized: true
  }));
  /*app.use(csrf());
  app.use(function(req, res, next) {
    res.locals._csrf = req.csrfToken();
    next();
  });*/
  app.use(cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
  }));

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
      return res.json(reply.success(app.params.getAllVariables()));
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
  const apiV1 = require('./api/v1/impl')(express, jsv, reply, helpers);
  app.use(apiV1.getRouterPath(), apiV1.getRouter());

  //---------------------------------------------------------------------------
  // start http server
  var server = app.listen(app.params.get('port'), app.params.get('lstn'), () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server is listening http://${host}:${port}`);
    console.log(app.params.getAllVariables());
  });
  //
  return { server:server, params:app.params };
}
