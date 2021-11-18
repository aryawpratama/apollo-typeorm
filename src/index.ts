import "reflect-metadata";
import { createConnection } from "typeorm";
require("dotenv").config();
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { handleRefreshToken } from "./controllers/main";
import cookieParser from "cookie-parser";
const startServer = async () => {
  // Typeorm Connection
  console.log("Connecting to database...");
  await createConnection();
  console.log("Database connected!");
  // Server
  const app = express();
  app.use(cookieParser());
  app.post("/refresh_token", handleRefreshToken);
  const httpServer = http.createServer(app);
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ res, req }) => ({ res, req }),
  });
  const PORT = process.env.PORT;
  console.log("Starting server...");
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  httpServer.listen(PORT, () => {
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: apolloServer.graphqlPath,
    });
    console.log(
      `Graphql server running on http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
    console.log(
      `Graphql websocket running on ws://localhost:${PORT}${apolloServer.graphqlPath}`
    );

    useServer({ schema }, wsServer);
  });
};
startServer();
