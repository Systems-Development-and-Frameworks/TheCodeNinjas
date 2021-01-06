import { DataSource } from "apollo-datasource";
import { GraphQLSchema } from "graphql";
import { gql } from "apollo-server";

export default class PersonsDatasource extends DataSource {
  constructor(private subSchemas: GraphQLSchema[], private executor: any) {
    super();
  }

  async queryPersonByEmail(email: string) {
    return {
      id: "1234",
      passwordHash: "4567",
      passwordSalt: "8901",
    };
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
