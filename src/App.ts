import dotenv from "dotenv";
import bodyParser from "body-parser";
import "reflect-metadata";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { bindings } from "./inversify.config";
import express from "express";
import { CustomAuthProvider } from "./apiBase/auth";
import cors from "cors"
import { ApolloServer } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import { importSchema } from 'graphql-import';
import resolvers from './graphql/resolvers'
import { ReqContext } from './graphql/types/server.types';
import { peopleFromHouseholdLoader, householdLoader } from './graphql/loader'
import { validateToken } from './graphql/helpers/account';

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
    // expApp.use(bodyParser({ limit: "50mb" }));
    // expApp.use()
    expApp.use(bodyParser.urlencoded({ extended: true }));
    expApp.use(bodyParser.json({ limit: "50mb" }));
    expApp.use(cors())
  };

  const server = app.setConfig(configFunction).build();
  const graphQLServer = new ApolloServer({
    typeDefs: importSchema('src/graphql/schema/schema.graphql'),
    resolvers,
    validationRules: [depthLimit(5)],
    context: (ctx: ReqContext) => {
      const { authorization } = ctx.req.headers
      if (authorization && typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
        const token = authorization.substr(7)
        const me = validateToken(token)
        ctx.me = me
      }
      ctx.peopleFromHouseHoldLoader = peopleFromHouseholdLoader()
      ctx.householdLoader = householdLoader()

      return ctx
    },
  })

  graphQLServer.applyMiddleware({
    app: server,
    path: '/graphql',
  })
  return server;
}
