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
    
    // Body parsing - Express built-in parsers work with @codegenie/serverless-express
    expApp.use(express.json({ limit: '50mb' }));
    expApp.use(express.urlencoded({ extended: true, limit: '50mb' }));
  };

  const server = app.setConfig(configFunction).build();


  return server;
};
