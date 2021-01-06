import { DataSource } from "apollo-datasource";
import { GraphQLSchema } from "graphql";
import { gql } from "apollo-server";
import { delegateToSchema } from "graphql-tools";

export default class PostsDatasource extends DataSource {
  constructor(private subSchemas: GraphQLSchema[], private executor: any) {
    super();
  }

  async delegatePost(context, info, postId) {
    const [graphCmsSchema] = this.subSchemas;

    return delegateToSchema({
      schema: graphCmsSchema,
      operation: "query",
      fieldName: "post",
      args: { where: { id: postId } },
      context,
      info,
    });
  }

  async createPost(postTitle: string, personId: string) {
    const mutation = gql`
      mutation($postTitle: String!, $personId: ID!) {
        createPost(
          data: { title: $postTitle, author: { connect: { id: $personId } } }
        ) {
          id
        }
      }
    `;

    return await this.executor({
      document: mutation,
      variables: {
        postTitle,
        personId,
      },
    });
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
