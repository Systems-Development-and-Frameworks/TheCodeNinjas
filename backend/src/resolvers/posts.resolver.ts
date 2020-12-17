import { GraphQLSchema } from "graphql";
import Post from "../entities/post.entity";
import { Executor } from "@graphql-tools/delegate/types";
import { SignupDto } from "../dtos/signup.dto";
import { DownvoteDto } from "../dtos/downvote";
import { UpvoteDto } from "../dtos/upvote.dto";
import { gql, UserInputError } from "apollo-server";

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
  return {
    async upvote(parent, args: UpvoteDto, context, info) {
      const personId = context.user.id;
      const postId = args.id;

      const mutation = gql`
        mutation($postId: ID!, $personId: ID!) {
          updatePost(
            where: { id: $postId }
            data: { voters: { connect: { where: { id: $personId } } } }
          ) {
            voters {
              id
            }
          }
        }
      `;

      const result = await executor({
        document: mutation,
        variables: {
          postId,
          personId,
        },
      });

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const post: Partial<Post> = result.data.updatePost;
        return post.voters.length;
      }
    },
    async downvote(parent, args: DownvoteDto, context, info) {
      const personId = context.user.id;
      const postId = args.id;

      const mutation = gql`
        mutation($postId: ID!, $personId: ID!) {
          updatePost(
            where: { id: $postId }
            data: { voters: { disconnect: { id: $personId } } }
          ) {
            voters {
              id
            }
          }
        }
      `;

      const result = await executor({
        document: mutation,
        variables: {
          postId,
          personId,
        },
      });

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const post: Partial<Post> = result.data.updatePost;
        return post.voters.length;
      }
    },
  };
}
