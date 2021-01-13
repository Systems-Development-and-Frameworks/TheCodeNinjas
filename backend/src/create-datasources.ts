import PostsDatasource from "./datasources/posts.datasource";
import PersonsDatasource from "./datasources/persons.datasource";
import { GraphQLSchema } from "graphql";

export default function (subSchemas: GraphQLSchema[], executor: any) {
  return () => ({
    postsDatasource: new PostsDatasource(subSchemas, executor),
    personsDatasource: new PersonsDatasource(subSchemas, executor),
  });
}
