'use strict';

var SwaggerExpress = require('swagger-express-mw');
const express = require('express');
var app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api/swagger/swagger.yaml');

module.exports = app; // for testing

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    APIKeyHeader: function (req, authOrSecDef, scopesOrApiKey, cb) {
      // your security code
      if ('1234' === scopesOrApiKey) {
        cb(null);
      } else {
        cb(new Error('access denied!'));
      }
    }
  }
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  const options = {
    security: [ { APIKeyHeader: [] } ]
  };

  config.swaggerSecurityHandlers = {
    APIKeyHeader: function securityHandler1(req, authOrSecDef, scopesOrApiKey, cb) {
      // your security code
      console.log("i came here");
      cb();
    }
  };

  // install middleware
  swaggerExpress.register(app);
  var port = process.env.PORT || 3000;
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options));
  app.use(cors);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
