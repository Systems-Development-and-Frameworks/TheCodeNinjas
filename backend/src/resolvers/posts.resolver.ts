import { GraphQLSchema } from "graphql";
import Post from "../entities/post.entity";

export function query(subSchemas: GraphQLSchema[]) {

  return {};
};

export function properties (subSchemas: GraphQLSchema[]) {
  
  return {    
    votes: {
      selectionSet: '{ voters }',
      resolve: (post: Post) => post.voters.length,
    },
  };
};

export function mutation (subSchemas: GraphQLSchema[]) {

  return {};
};

