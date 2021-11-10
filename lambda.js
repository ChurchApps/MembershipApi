const { createServer, proxy } = require('aws-serverless-express');
const { init } = require('./dist/App');
const { Pool } = require('./dist/apiBase/pool');
const { Environment } = require('./dist/helpers/Environment');

Environment.init(process.env.APP_ENV);
Pool.initPool();

module.exports.universal = function universal(event, context) {
  init().then(app => {
    const server = createServer(app);
    return proxy(server, event, context);
  });

}