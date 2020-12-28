import { ApolloServer } from "apollo-server";

import createResolvers from "./create-resolvers";

import { applyMiddleware } from "graphql-middleware";
import createPermissions from "./create-permissions";

import createDatasources from "./create-datasources";
import createContext from "./create-context";
import typeDefs from "./type-defs";
import { stitchSchemas } from "@graphql-tools/stitch";

import { ApolloServerExpressConfig } from "apollo-server-express";
import createGraphCmsSchema, { executor } from "./create-graph-cms-schema";

export default class ServerInitializer {
  async createServer(config: ApolloServerExpressConfig = {}) {
    const graphCmsSchema = await createGraphCmsSchema();

    const gatewaysSchema = stitchSchemas({
      subschemas: [graphCmsSchema],
      typeDefs,
      resolvers: createResolvers([graphCmsSchema], executor),
    });

    const permissions = createPermissions([graphCmsSchema], executor);
    const schemaWithMiddleware = applyMiddleware(gatewaysSchema, permissions);

    return new ApolloServer({
      schema: schemaWithMiddleware,
      context: createContext(),
      dataSources: createDatasources,
      playground: true,
      ...config,
    });
  }
}
