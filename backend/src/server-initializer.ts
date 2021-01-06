import { ApolloServer } from "apollo-server";

import createResolvers from "./create-resolvers";

import { applyMiddleware } from "graphql-middleware";
import createPermissions from "./create-permissions";

import createDatasources from "./create-datasources";
import createContext from "./create-context";
import typeDefs from "./type-defs";
import { stitchSchemas } from "@graphql-tools/stitch";

import { ApolloServerExpressConfig } from "apollo-server-express";

export default class ServerInitializer {
  async createServer(
    config: ApolloServerExpressConfig = {},
    createGraphCmsSchema,
    executor
  ) {
    const graphCmsSchema = await createGraphCmsSchema();
    console.log('test', graphCmsSchema);

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
      dataSources: createDatasources([graphCmsSchema], executor),
      playground: true,
      introspection: true,
      ...config,
    });
  }
}
