import { GraphQLSchema } from "graphql";
import Post from "../entities/post.entity";
import { Executor } from "@graphql-tools/delegate/types";

export function query(subSchemas: GraphQLSchema[], executor: Executor) {
  return {};
}

export function properties(subSchemas: GraphQLSchema[], executor: Executor) {
  return {
    votes: {
      selectionSet: "{ voters { id } }",
      resolve: (post: Post) => post.voters.length,
    },
  };
}

export function mutation(subSchemas: GraphQLSchema[], executor: Executor) {
  return {};
}
