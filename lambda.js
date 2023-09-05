const { createServer, proxy } = require('aws-serverless-express');
const { init } = require('./dist/App');
const { Pool } = require('@churchapps/apihelper');
const { Environment } = require('./dist/helpers/Environment');

const checkPool = async () => {
  if (!Environment.connectionString) {
    await Environment.init(process.env.APP_ENV)
    Pool.initPool();
  }
}

module.exports.universal = function universal(event, context) {
  checkPool().then(() => {
    init().then(app => {
      const server = createServer(app);
      return proxy(server, event, context);
    });
  });
}