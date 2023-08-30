const { createServer, proxy } = require('aws-serverless-express');
const { init } = require('./dist/App');
const { Pool } = require('@churchapps/apihelper');
const { Environment } = require('./dist/helpers/Environment');

Environment.init(process.env.APP_ENV).then(() => {
  Pool.initPool();
});

module.exports.universal = function universal(event, context) {
  init().then(app => {
    const server = createServer(app);
    return proxy(server, event, context);
  });

}