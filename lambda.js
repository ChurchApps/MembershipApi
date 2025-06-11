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
let app;

const universal = async function universal(event, context) {
  try {
    await checkPool();
    
    // Initialize app only once to prevent multiple body parser registrations
    if (!app) {
      app = await init();
    }
    
    // Configure serverless express only once
    if (!serverlessExpressInstance) {
      serverlessExpressInstance = configure({ 
        app,
        binaryMimeTypes: [
          'application/octet-stream',
          'font/*',
          'image/*',
          'application/pdf'
        ]
      });
    }
    
    return serverlessExpressInstance(event, context);
  } catch (error) {
    console.error('Lambda handler error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}

module.exports.universal = universal;
