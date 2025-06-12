const serverlessExpress = require('@codegenie/serverless-express');
const { init } = require('./dist/App');
const { Pool } = require('@churchapps/apihelper');
const { Environment } = require('./dist/helpers/Environment');

const checkPool = async () => {
  if (!Environment.connectionString) {
    await Environment.init(process.env.APP_ENV)
    Pool.initPool();
  }
}

let handler;

const universal = async function universal(event, context) {
  try {
    console.log('Lambda invocation:', event.httpMethod, event.path);
    
    await checkPool();
    
    // Initialize the handler only once
    if (!handler) {
      const app = await init();
      handler = serverlessExpress({ 
        app,
        binarySettings: {
          contentTypes: [
            'application/octet-stream',
            'font/*', 
            'image/*',
            'application/pdf'
          ]
        },
        stripBasePath: false,
        resolutionMode: 'PROMISE'
      });
    }
    
    return handler(event, context);
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