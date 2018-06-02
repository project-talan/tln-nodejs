'use strict';

// global consts
const prjName = 'nodejs';
const prjNameCap = prjName.toUpperCase();
const prjEnvPrefix = `SERVICES_${prjNameCap}`;

// common modules
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

// project specific modules
//
const jsv = require('./utils/jsv')({ allErrors:true, removeAdditional:'all' });
// API response composer
const reply = require('./utils/reply')();
// helpers
const helpers = require('./utils/helpers')(jsv, reply);

// app
// global application middleware
const app = express();
app.use(bodyParser.json());
app.use(function (err, req, res, next) {
  if (err instanceof SyntaxError) {
    return res.status(400).json(reply.fail(`Input json Syntax error: '${err.message}'`));
  } else {
    next(err);
  }
});


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

// service parameters
app.params = require('./utils/params')(prjName, { 
  host:   { env:`${prjEnvPrefix}_HOST`, def:'localhost' },
  lstn:   { env:`${prjEnvPrefix}_LSTN`, def:'0.0.0.0' },
  port:   { env:`${prjEnvPrefix}_PORT`, def:80 },
  ports:  { env:`${prjEnvPrefix}_PORTS`, def: 443 },
  version:{ env:`PROJECT_VERSION`, def:'0.1.0' }
});

// heakthcheck endpoint
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
  
// start http server
var server = app.listen(app.params.get('port'), app.params.get('lstn'), () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server is listening http://${host}:${port}`);
});
module.exports = { server:server, params:app.params };

