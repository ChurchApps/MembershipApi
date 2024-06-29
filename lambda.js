const serverlessExpress = require('@codegenie/serverless-express')
const { init } = require('./dist/App');
const { Pool } = require('@churchapps/apihelper');
const { Environment } = require('./dist/helpers/Environment');

let cachedServer;

const checkPool = async () => {
  if (!Environment.connectionString) {
    await Environment.init(process.env.APP_ENV);
    Pool.initPool();
  }
};

async function setup (event, context) {
  await checkPool();
  const app = await init();
  cachedServer = serverlessExpress({ app })
  return cachedServer(event, context)
};

module.exports.universal = function universal(event, context) {
  if (cachedServer) return cachedServer(event, context)
  return setup(event, context)
}