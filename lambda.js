const serverlessExpress = require('@codegenie/serverless-express');
const { init } = require('./dist/src/App');
const { Pool } = require('@churchapps/apihelper');
const { Environment } = require('./dist/src/helpers/Environment');

const checkPool = async () => {
  if (!Environment.connectionString) {
    await Environment.init(process.env.APP_ENV)
    Pool.initPool();
  }
}

let handler;

const universal = async function universal(event, context) {
  try {
    console.log('Lambda invoked with event:', JSON.stringify(event, null, 2));
    console.log('Event httpMethod:', event.httpMethod);
    console.log('Event path:', event.path);
    
    await checkPool();
    
    // Initialize the handler only once
    if (!handler) {
      const app = await init();
      console.log('Express app initialized');
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
      console.log('Serverless Express handler created');
    }
    
    const result = await handler(event, context);
    console.log('Handler returned:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
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