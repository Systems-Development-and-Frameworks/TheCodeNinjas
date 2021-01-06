import { DataSource } from "apollo-datasource";
import { GraphQLSchema } from "graphql";
import { gql } from "apollo-server";
import { delegateToSchema } from "graphql-tools";

export default class PostsDatasource extends DataSource {
  constructor(private subSchemas: GraphQLSchema[], private executor: any) {
    super();
  }

  async delegatePost(context, info, postId) {
    return {
      title: "Some post",
      id: "123",
    };
  }

  async createPost(postTitle: string, personId: string) {
    return {
      data: {
        createPost: {
          title: postTitle,
          id: "123",
        },
      },
    };
  }

  async deletePost(postId: string) {
    const mutation = gql`
      mutation($postId: ID!) {
        deletePost(where: { id: $postId }) {
          id
        }
      }
    `;

    return await this.executor({
      document: mutation,
      variables: {
        postId,
      },
    });
  }

  async connectPersonToPost(postId: string, personId: string) {
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

    return await this.executor({
      document: mutation,
      variables: {
        postId,
        personId,
      },
    });
  }

  async disconnectPersonFromPost(postId, personId) {
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

    return await this.executor({
      document: mutation,
      variables: {
        postId,
        personId,
      },
    });
  }
}
