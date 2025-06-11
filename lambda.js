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
    console.log('Lambda invocation started');
    console.log('Node modules path check:', require.resolve('express'));
    
    await checkPool();
    
    // Initialize app only once to prevent multiple body parser registrations
    if (!app) {
      console.log('Initializing Express app...');
      app = await init();
    }
    
    // Configure serverless express only once
    if (!serverlessExpressInstance) {
      console.log('Configuring serverless express...');
      serverlessExpressInstance = configure({ 
        app,
        binaryMimeTypes: [
          'application/octet-stream',
          'font/*',
          'image/*',
          'application/pdf'
        ],
        stripBasePath: true,
        respondWithErrors: true,
        eventSourceName: 'AWS_API_GATEWAY'
      });
    }
    
    return serverlessExpressInstance(event, context);
  } catch (error) {
    console.error('Lambda handler error:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
}

module.exports.universal = universal;
