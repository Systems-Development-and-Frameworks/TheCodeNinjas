import { GraphQLSchema } from "graphql";
import Post from "../entities/post.entity";
import { Executor } from "@graphql-tools/delegate/types";
import { DownvoteDto } from "../dtos/downvote.dto";
import { UpvoteDto } from "../dtos/upvote.dto";
import { gql, UserInputError } from "apollo-server";
import { WriteDto } from "../dtos/write.dto";
import { DeleteDto } from "../dtos/delete.dto";
import { delegateToSchema } from "graphql-tools";

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
  const [graphCmsSchema] = subSchemas;

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
        const postId = result.data.createPost.id;

        return delegateToSchema({
          schema: graphCmsSchema,
          operation: "query",
          fieldName: "post",
          args: { where: { id: postId } },
          context,
          info,
        });
      }
    },
    async delete(parent, args: DeleteDto, context, info) {
      const postId = args.id;

      const delegationResult = await delegateToSchema({
        schema: graphCmsSchema,
        operation: "query",
        fieldName: "post",
        args: { where: { id: postId } },
        context,
        info,
      });

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
        return delegationResult;
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
            id
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
        const postId = result.data.updatePost.id;

        return delegateToSchema({
          schema: graphCmsSchema,
          operation: "query",
          fieldName: "post",
          args: { where: { id: postId } },
          context,
          info,
        });
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
            id
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
        const postId = result.data.updatePost.id;

        return delegateToSchema({
          schema: graphCmsSchema,
          operation: "query",
          fieldName: "post",
          args: { where: { id: postId } },
          context,
          info,
        });
      }
    },
  };
}
