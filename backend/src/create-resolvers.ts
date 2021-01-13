import { GraphQLSchema } from "graphql";
import {
  mutation as postsMutation,
  properties as postsProperties,
  query as postsQuery,
} from "./resolvers/posts.resolver";
import {
  mutation as personsMutation,
  properties as personsProperties,
  query as personsQuery,
} from "./resolvers/persons.resolver";

export default function createResolvers(
  subSchemas: GraphQLSchema[],
  executor: any
) {
  return {
    Query: {
      ...postsQuery(subSchemas, executor),
      ...personsQuery(subSchemas, executor),
    },
    Mutation: {
      ...personsMutation(subSchemas, executor),
      ...postsMutation(subSchemas, executor),
    },
    Post: postsProperties(subSchemas, executor),
    Person: personsProperties(subSchemas, executor),
  };
}
