import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import PostDatasource from "../datasources/post.datasource";
import UserDatasource from "../datasources/user.datasource";
import { posts, users } from "../test-data";
import ServerInitializer from "../server-initializer";

const postDatasource = new PostDatasource(posts);
const userDatasource = new UserDatasource(users);
const dataSource = {
  postDatasource: postDatasource,
  userDatasource: userDatasource,
};

const serverInitializer = new ServerInitializer();
const serverUnauthorized = serverInitializer.createServer({
  dataSources: () => dataSource,
});

describe("queries", () => {
  describe("USERS", () => {
    const USERS = gql`
      query {
        users {
          id
          email
          name
        }
      }
    `;

    const action = (query) => {
      return query({ query: USERS });
    };

    beforeEach(() => {
      postDatasource.reset();
      userDatasource.reset();
    });

    it("should return seeded users", async () => {
      const { query } = createTestClient(serverUnauthorized);
      const response = action(query);

      await expect(response).resolves.toMatchObject({
        errors: undefined,
        data: {
          users: [
            {
              id: "58334916-ae55-4149-add5-0bc11f1b43c6",
              name: "Christoph Stach",
              email: "s0555912@htw-berlin.de",
            },
            {
              id: "16787679-8a07-4742-8d60-97e72bbc8049",
              name: "Phillip",
              email: "s0557917@htw-berlin.de",
            },
            {
              id: "c140c845-ab82-425d-ab5b-6d4d80955cb0",
              name: "Florian",
              email: "s0558101@htw-berlin.de",
            },
          ],
        },
      });
    });
  });
});

describe("mutations", () => {
  // TODO: mutations signIn and signUp
});
