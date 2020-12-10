import { ApolloServer } from "apollo-server";

import createResolvers from "./create-resolvers";

import { applyMiddleware } from "graphql-middleware";
import permissions from "./permissions";

import createDatasources from "./create-datasources";
import createContext from "./create-context";
import typeDefs from "./type-defs";
import { stitchSchemas } from "@graphql-tools/stitch";

import { ApolloServerExpressConfig } from "apollo-server-express";
import createGraphCmsSchema from "./create-graph-cms-schema";

export default class ServerInitializer {
  async createServer(defaultConfig: ApolloServerExpressConfig = {}) {
    const graphCmsSchema = await createGraphCmsSchema();
    const gatewaysSchema = stitchSchemas({
      subschemas: [graphCmsSchema],
      mergeTypes: true,
      typeDefs,
      resolvers: createResolvers(),
    });

    const schemaWithMiddleware = applyMiddleware(gatewaysSchema, permissions);

    return new ApolloServer({
      schema: gatewaysSchema,
      context: createContext([graphCmsSchema]),
      dataSources: createDatasources,
      ...defaultConfig,
    });
  }
}
