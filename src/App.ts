import dotenv from "dotenv";
import "reflect-metadata";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { bindings } from "./inversify.config";
import express from "express";
import { CustomAuthProvider } from "@churchapps/apihelper";
import cors from "cors";

export const init = async () => {
  /*
  AWS.config.update({ region: 'us-east-2' });
  const logger = winston.createLogger({
      transports: [new WinstonCloudWatch({ logGroupName: 'AccessManagementStage', logStreamName: 'API' })],
      format: winston.format.json()
  });
  logger.info("App Logger initialized");*/

  dotenv.config();
  const container = new Container();
  await container.loadAsync(bindings);
  const app = new InversifyExpressServer(container, null, null, null, CustomAuthProvider);


  const configFunction = (expApp: express.Application) => {
    // Configure CORS first
    expApp.use(cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
    }));
    
    // Handle preflight requests early
    expApp.options('*', (req, res) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
      res.sendStatus(200);
    });
    
    // Middleware to ensure body is available for POST requests
    expApp.use((req, res, next) => {
      console.log('Request method:', req.method);
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Body available:', req.body !== undefined);
      console.log('Raw body available:', (req as any).rawBody !== undefined);
      
      // @vendia/serverless-express should populate req.body automatically
      // If it's not there, set an empty object
      if (req.body === undefined) {
        req.body = {};
      }
      
      next();
    });
  };

  const server = app.setConfig(configFunction).build();


  return server;
};
