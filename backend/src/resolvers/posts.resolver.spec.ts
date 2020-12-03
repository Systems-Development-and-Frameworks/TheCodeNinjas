import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import PostDatasource from "../datasources/post.datasource";
import { posts, users } from "../test-data";
import UserDatasource from "../datasources/user.datasource";
import ServerInitializer from "../server-initializer";
import { JwtPayload } from "../jwt-payload";
import * as dotenv from "dotenv";

dotenv.config();

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

const serverAuthorized = serverInitializer.createServer({
  dataSources: () => dataSource,
  context: () => {
    return {
      user: {
        id: "58334916-ae55-4149-add5-0bc11f1b43c6",
      } as JwtPayload,
    };
  },
});

describe("queries", () => {
  describe("POSTS", () => {
    const POSTS = gql`
      query {
        posts {
          id
          title
        }
      }
    `;

    const action = (query) => {
      return query({ query: POSTS });
    };

    beforeEach(() => {
      postDatasource.reset();
      userDatasource.reset();
    });

    it("should return an empty array", async () => {
      postDatasource.posts = [];

      const { query } = createTestClient(serverUnauthorized);
      const response = action(query);

      await expect(response).resolves.toMatchObject({
        errors: undefined,
        data: { posts: [] },
      });
    });

    it("should return seeded post data ", async () => {
      const { query } = createTestClient(serverUnauthorized);
      const response = action(query);

      await expect(response).resolves.toMatchObject({
        errors: undefined,
        data: {
          posts: [
            {
              id: "7ed8828b-f4de-4359-8160-1df1ff3234cd",
              title: "Ein Toller Title",
            },
            {
              id: "bea730b9-1585-4de2-9524-84fde899da7c",
              title: "Phillips Post",
            },
            {
              id: "b0684837-5261-4f63-81bb-432f4ea409bc",
              title: "Flos Post",
            },
            {
              id: "10af216d-59bb-4cc1-9a27-246f22c2bee6",
              title: "Noch ein Post",
            },
          ],
        },
      });
    });
  });
});

describe("mutations", () => {
  describe("WRITE_POST", () => {
    const WRITE_POST = gql`
      mutation($post: PostInput!) {
        write(post: $post) {
          id
          title
        }
      }
    `;

    const action = (mutate) => {
      return mutate({
        mutation: WRITE_POST,
        variables: {
          post: {
            title: "Some post",
          },
        },
      });
    };

    beforeEach(() => {
      postDatasource.reset();
      userDatasource.reset();
    });

    it("should responds not authorized if no JWT was given", async () => {
      const { mutate } = createTestClient(serverUnauthorized);
      const response = action(mutate);

      await expect(response).resolves.toMatchObject({
        errors: [
          // https://jestjs.io/docs/en/expect#expectobjectcontainingobject
          expect.objectContaining({ message: "Not Authorised!" }),
        ],
        data: {
          write: null,
        },
      });
    });

    it("should create post ", async () => {
      const { mutate } = createTestClient(serverAuthorized);
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

    beforeEach(() => {
      postDatasource.reset();
      userDatasource.reset();
    });

    it("should throw an error if not authorized", async () => {
      const { mutate } = createTestClient(serverUnauthorized);
      const response = action("7ed8828b-f4de-4359-8160-1df1ff3234cd", mutate);

      await expect(response).resolves.toMatchObject({
        errors: [
          // https://jestjs.io/docs/en/expect#expectobjectcontainingobject
          expect.objectContaining({ message: "Not Authorised!" }),
        ],
        data: {
          upvote: null,
        },
      });
    });

    it("should add one vote to the post", async () => {
      const { mutate } = createTestClient(serverAuthorized);
      const response = await action(
        "7ed8828b-f4de-4359-8160-1df1ff3234cd",
        mutate
      );

      expect(response.data.upvote.votes).toBe(1);
    });

    it("should not add two votes to the post", async () => {
      const { mutate } = createTestClient(serverAuthorized);

      await action("7ed8828b-f4de-4359-8160-1df1ff3234cd", mutate);

      const response = await action(
        "7ed8828b-f4de-4359-8160-1df1ff3234cd",
        mutate
      );

      expect(response.data.upvote.votes).toBe(1);
    });
  });
});
