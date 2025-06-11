const { configure } = require('@vendia/serverless-express');
const { init } = require('./dist/App');
const { Pool } = require('@churchapps/apihelper');
const { Environment } = require('./dist/helpers/Environment');

const checkPool = async () => {
  if (!Environment.connectionString) {
    await Environment.init(process.env.APP_ENV)
    Pool.initPool();
  }
}

let serverlessExpressInstance;

const universal = async function universal(event, context) {
  await checkPool();
  const app = await init();
  serverlessExpressInstance = configure({ app });
  return serverlessExpressInstance(event, context);
}

module.exports.universal = universal;
