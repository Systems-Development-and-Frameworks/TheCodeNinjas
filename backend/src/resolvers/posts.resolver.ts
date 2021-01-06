import { GraphQLSchema } from "graphql";
import Post from "../entities/post.entity";
import { Executor } from "@graphql-tools/delegate/types";
import { DownvoteDto } from "../dtos/downvote.dto";
import { UpvoteDto } from "../dtos/upvote.dto";
import { UserInputError } from "apollo-server";
import { WriteDto } from "../dtos/write.dto";
import { DeleteDto } from "../dtos/delete.dto";
import PostsDatasource from "../datasources/posts.datasource";

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
      const postsDatasource: PostsDatasource =
        context.dataSources.postsDatasource;

      const result = await postsDatasource.createPost(postTitle, personId);

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const postId = result.data.createPost.id;
        return postsDatasource.delegatePost(context, info, postId);
      }
    },
    async delete(parent, args: DeleteDto, context, info) {
      const postId = args.id;
      const postsDatasource: PostsDatasource =
        context.dataSources.postsDatasource;

      const delegationResult = postsDatasource.delegatePost(
        context,
        info,
        postId
      );

      const result = await postsDatasource.deletePost(postId);

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
      const postsDatasource: PostsDatasource =
        context.dataSources.postsDatasource;

      const result = await postsDatasource.connectPersonToPost(
        postId,
        personId
      );

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const postId = result.data.updatePost.id;

        return postsDatasource.deletePost(postId);
      }
    },
    async downvote(parent, args: DownvoteDto, context, info) {
      const personId = context.user.id;
      const postId = args.id;
      const postsDatasource: PostsDatasource =
        context.dataSources.postsDatasource;

      const result = await postsDatasource.disconnectPersonFromPost(
        postId,
        personId
      );

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const postId = result.data.updatePost.id;

        return postsDatasource.deletePost(postId);
      }
    },
  };
}
