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
    console.log('Lambda invocation started');
    console.log('Event keys:', Object.keys(event));
    console.log('Event version:', event.version);
    console.log('Event httpMethod:', event.httpMethod);
    console.log('Event requestContext:', JSON.stringify(event.requestContext || {}, null, 2));
    
    await checkPool();
    
    // Initialize the handler only once
    if (!handler) {
      console.log('Initializing serverless express handler...');
      const app = await init();
      handler = serverlessExpress({ app });
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