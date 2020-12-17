import { ApolloServer } from "apollo-server";

import createResolvers from "./create-resolvers";

import { applyMiddleware } from "graphql-middleware";
import permissions from "./permissions";

import createDatasources from "./create-datasources";
import createContext from "./create-context";
import typeDefs from "./type-defs";
import { stitchSchemas } from "@graphql-tools/stitch";

import { ApolloServerExpressConfig } from "apollo-server-express";
import createGraphCmsSchema, { executor } from "./create-graph-cms-schema";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

export default class ServerInitializer {
  async createServer(config: ApolloServerExpressConfig = {}) {
    const localSchema = loadSchemaSync("./src/schema/**/*.graphql", {
      loaders: [new GraphQLFileLoader()],
    });

    const graphCmsSchema = await createGraphCmsSchema();


    const gatewaysSchema = stitchSchemas({
      subschemas: [graphCmsSchema],
      typeDefs: localSchema,
      resolvers: createResolvers([graphCmsSchema], executor),
    });

    const schemaWithMiddleware = applyMiddleware(gatewaysSchema, permissions);

    return new ApolloServer({
      schema: schemaWithMiddleware,
      context: createContext(),
      dataSources: createDatasources,
      ...config,
    });
  }
}
