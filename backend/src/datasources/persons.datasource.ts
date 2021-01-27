import { DataSource } from "apollo-datasource";
import { GraphQLSchema } from "graphql";
import { gql } from "apollo-server";

export default class PersonsDatasource extends DataSource {
  constructor(private subSchemas: GraphQLSchema[], private executor: any) {
    super();
  }

  async queryPersonByEmail(email: string) {
    const query = gql`
      query($email: String!) {
        person(where: { email: $email }) {
          id
          name
          email
          passwordHash
          passwordSalt
        }
      }
    `;

    return await this.executor({
      document: query,
      variables: { email },
    });
  }

  async createPerson(
    name: string,
    email: string,
    passwordHash: string,
    passwordSalt: string
  ) {
    const mutation = gql`
      mutation(
        $name: String!
        $email: String!
        $passwordHash: String!
        $passwordSalt: String!
      ) {
        createPerson(
          data: {
            name: $name
            email: $email
            passwordHash: $passwordHash
            passwordSalt: $passwordSalt
          }
        ) {
          id
          name
          email
        }
      }
    `;

    return await this.executor({
      document: mutation,
      variables: {
        name,
        email,
        passwordHash,
        passwordSalt,
      },
    });
  }
}
