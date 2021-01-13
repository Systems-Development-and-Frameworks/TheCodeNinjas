import { DataSource } from "apollo-datasource";
import { GraphQLSchema } from "graphql";
import { gql } from "apollo-server";

export default class PersonsDatasource extends DataSource {
  constructor(private subSchemas: GraphQLSchema[], private executor: any) {
    super();
  }

  async queryPersonByEmail(email: string) {
    return {
      data: {
        person: {
          id: "58334916-ae55-4149-add5-0bc11f1b43c6",
          passwordHash:
            "$2b$10$jn8BT0wp60EIhtC08TCbfeJHkSw3unn7vN0Nogv7g7G.ufWXu0ucG", // chrisPW
          passwordSalt: "$2b$10$jn8BT0wp60EIhtC08TCbfe",
        },
      },
    };
  }

  async createPerson(
    name: string,
    email: string,
    passwordHash: string,
    passwordSalt: string
  ) {
    return {
      data: {
        person: {
          id: "123",
        },
      },
    };
  }
}
