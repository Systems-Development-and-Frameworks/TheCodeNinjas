import { gql } from "apollo-server";
import { importSchema } from "graphql-import";

const typeDefs = gql(importSchema('src/schema.graphql'));
export default typeDefs; 