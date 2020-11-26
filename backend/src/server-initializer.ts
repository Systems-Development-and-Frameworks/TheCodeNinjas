import { ApolloServer } from "apollo-server";

import resolvers from "./resolvers";

import { applyMiddleware } from "graphql-middleware";
import permissions from "./permissions";

import createDatasources from "./create-datasources";
import createContext from "./create-context";
import typeDefs from "./type-defs";

import { makeExecutableSchema } from "graphql-tools";

export default class ServerInitializer {
  createServer() {
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    const schemaWithMiddleware = applyMiddleware(schema, permissions);

    return new ApolloServer({
      schema: schemaWithMiddleware,
      context: createContext,
      dataSources: createDatasources,
    });
  }
}
