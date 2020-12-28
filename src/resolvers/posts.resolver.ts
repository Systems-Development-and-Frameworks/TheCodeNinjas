import { GraphQLSchema } from "graphql";
import Post from "../entities/post.entity";
import { Executor } from "@graphql-tools/delegate/types";
import { DownvoteDto } from "../dtos/downvote.dto";
import { UpvoteDto } from "../dtos/upvote.dto";
import { gql, UserInputError } from "apollo-server";
import { WriteDto } from "../dtos/write.dto";
import { DeleteDto } from "../dtos/delete.dto";

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
    async write(parent, args: WriteDto, context, info) {
      const personId = context.user.id;
      const postTitle = args.title;

      const mutation = gql`
        mutation($postTitle: String!, $personId: ID!) {
          createPost(
            data: { title: $postTitle, author: { connect: { id: $personId } } }
          ) {
            id
          }
        }
      `;

      const result = await executor({
        document: mutation,
        variables: {
          postTitle,
          personId,
        },
      });

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const post: Partial<Post> = result.data.createPost;
        return post.id;
      }
    },
    async delete(parent, args: DeleteDto, context, info) {
      // const personId = context.user.id;
      const postId = args.id;

      const mutation = gql`
        mutation($postId: ID!) {
          deletePost(where: { id: $postId }) {
            id
          }
        }
      `;

      const result = await executor({
        document: mutation,
        variables: {
          postId,
        },
      });

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const post: Partial<Post> = result.data.deletePost;
        return post.id;
      }
    },
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
