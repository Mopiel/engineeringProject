import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";
import mongoose from "mongoose";

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  server.applyMiddleware({ app });

  await mongoose.connect("mongodb://127.0.0.1:27017/inzynierka", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
};

startServer();
