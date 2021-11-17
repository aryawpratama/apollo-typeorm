import "reflect-metadata";
import { createConnection } from "typeorm";
require("dotenv").config();
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
const env = process.env;
const startServer = async () => {
  // Typeorm
  console.log("Connecting to database...");
  await createConnection();
  console.log("Database connected!");
  // Server
  const app = express();
  const httpServer = http.createServer(app);
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  console.log("Starting server...");

  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: env.PORT }, resolve)
  );
  console.log(
    `Server ready at http://localhost:${env.PORT}${server.graphqlPath}`
  );
};
startServer();
