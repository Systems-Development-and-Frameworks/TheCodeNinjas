import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import PostsDatasource from "../datasources/posts.datasource";
import PersonsDatasource from "../datasources/persons.datasource";
import ServerInitializer from "../server-initializer";
import * as dotenv from "dotenv";
import createGraphCmsSchema, {
  executor,
} from "../graph-cms/create-graph-cms-schema";

jest.mock("../datasources/posts.datasource");
jest.mock("../datasources/persons.datasource");
jest.mock("../graph-cms/create-graph-cms-schema");

dotenv.config();

const serverInitializer = new ServerInitializer();
const serverUnauthorized = serverInitializer.createServer(
  {
    dataSources: () => ({
      postsDatasource: new PostsDatasource(null, null),
      personsDatasource: new PersonsDatasource(null, null),
    }),
  },
  createGraphCmsSchema,
  executor
);

const serverAuthorized = serverInitializer.createServer(
  {
    dataSources: () => ({
      postsDatasource: new PostsDatasource(null, null),
      personsDatasource: new PersonsDatasource(null, null),
    }),
    context: () => {
      return {
        user: {
          id: "123",
        },
      };
    },
  },
  createGraphCmsSchema,
  executor
);

describe("mutations", () => {
  describe("WRITE_POST", () => {
    const WRITE_POST = gql`
      mutation($title: String!) {
        write(title: $title) {
          id
          title
        }
      }
    `;

    const action = (mutate) => {
      return mutate({
        mutation: WRITE_POST,
        variables: {
          title: "Some post",
        },
      });
    };

    it("should responds not authorized if no JWT was given", async () => {
      const { mutate } = createTestClient(await serverUnauthorized);
      const response = action(mutate);

      await expect(response).resolves.toMatchObject({
        errors: [
          // https://jestjs.io/docs/en/expect#expectobjectcontainingobject
          expect.objectContaining({ message: "No access allowed!" }),
        ],
        data: {
          write: null,
        },
      });
    });

    it("should create post ", async () => {
      const { mutate } = createTestClient(await serverAuthorized);
      const response = action(mutate);

      await expect(response).resolves.toMatchObject({
        errors: undefined,
        data: {
          write: {
            title: "Some post",
            id: expect.any(String),
          },
        },
      });
    });
  });

  describe("UPVOTE_POST", () => {
    const UPVOTE_POST = gql`
      mutation($id: ID!) {
        upvote(id: $id) {
          votes
        }
      }
    `;

    const action = (id, mutate) => {
      return mutate({
        mutation: UPVOTE_POST,
        variables: {
          id,
        },
      });
    };

    it("should throw an error if not authorized", async () => {
      const { mutate } = createTestClient(await serverUnauthorized);
      const response = action("7ed8828b-f4de-4359-8160-1df1ff3234cd", mutate);

      await expect(response).resolves.toMatchObject({
        errors: [
          // https://jestjs.io/docs/en/expect#expectobjectcontainingobject
          expect.objectContaining({ message: "No access allowed!" }),
        ],
        data: {
          upvote: null,
        },
      });
    });
  });

  describe("DOWNVOTE_POST", () => {
    const UPVOTE_POST = gql`
      mutation($id: ID!) {
        downvote(id: $id) {
          votes
        }
      }
    `;

    const action = (id, mutate) => {
      return mutate({
        mutation: UPVOTE_POST,
        variables: {
          id,
        },
      });
    };

    it("should throw an error if not authorized", async () => {
      const { mutate } = createTestClient(await serverUnauthorized);
      const response = action("7ed8828b-f4de-4359-8160-1df1ff3234cd", mutate);

      await expect(response).resolves.toMatchObject({
        errors: [
          // https://jestjs.io/docs/en/expect#expectobjectcontainingobject
          expect.objectContaining({ message: "No access allowed!" }),
        ],
        data: {
          downvote: null,
        },
      });
    });
  });
});
