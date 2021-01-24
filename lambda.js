const { createServer, proxy } = require('aws-serverless-express');
const { init } = require('./dist/App');
const { Pool } = require('./dist/apiBase/pool');

Pool.initPool();

module.exports.universal = function universal(event, context) {
    init().then(app => {
        const server = createServer(app);
        return proxy(server, event, context);
    });

}