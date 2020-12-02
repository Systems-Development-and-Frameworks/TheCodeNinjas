import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import ServerInitializer from "../server-initializer";
import { users } from "../seed-data";
import PostDatasource from "./post.datasource";
import UserDatasource from "./user.datasource";
import User from "../entities/user.entity";
import { JwtPayload } from "../jwt-payload";

let postDb = new PostDatasource();
const userDb = new UserDatasource();
const dataSource = { postDatasource: postDb, userDatasource: userDb };
userDb.users = users;
postDb.posts = [];




const serverInitializer = new ServerInitializer();
const serverUnauthorized = serverInitializer.createServer({
  dataSources: () => dataSource
}
);

const serverAuthorized = serverInitializer.createServer({
  dataSources: () => dataSource,
  context: () => {
    return {
      user: {
        id: "58334916-ae55-4149-add5-0bc11f1b43c6",
      } as Partial<JwtPayload>
    }
  },
}
);


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

    it("returns empty array", async () => {
      const { query, mutate } = createTestClient(serverUnauthorized);
      await expect(query({ query: POSTS })).resolves.toMatchObject({
        errors: undefined,
        data: { posts: [] },
      });
    });

    describe("given posts in the database", () => {
      beforeEach(() => {
        postDb.posts = [
          {
            id: "1", // uuid.v4(),
            title: "Ein Toller Title",
            user: "58334916-ae55-4149-add5-0bc11f1b43c6",
            voters: [],
          },
        ];
      });

      it("returns posts", async () => {
        const { query, mutate } = createTestClient(serverUnauthorized);
        await expect(query({ query: POSTS })).resolves.toMatchObject({
          errors: undefined,
          data: {
            posts: [
              {
                id: "1",
                title: "Ein Toller Title",
              },
            ],
          },
        });
      });
    });
  });
  describe("USERS", () => {
    const USERS = gql`
      query {
        users {
          email
          id
          name
        }
      }
    `;

    it("returns all users", async () => {
      const { query, mutate } = createTestClient(serverUnauthorized);
      await expect(query({ query: USERS })).resolves.toMatchObject({
        errors: undefined,
        data: {
          users: users.map((u) => {
            return {
              id: u.id,
              email: u.email,
              name: u.name,
            } as Partial<User>;
          }),
        },
      });
    });
  });
});

describe("mutations", () => {
  beforeEach(() => {
    postDb = new PostDatasource();
  });

  describe("WRITE_POST", () => {
    const action = (mutate) =>
      mutate({
        mutation: WRITE_POST,
        variables: {
          post: {
            title: "Some post",
          },
        },
      });
    const WRITE_POST = gql`
      mutation($post: PostInput!) {
        write(post: $post) {
          id
          title
        }
      }
    `;

    it("responds Not Authorised since no jwt", async () => {
      const { query, mutate } = createTestClient(serverUnauthorized);
      await expect(action(mutate)).resolves.toMatchObject({
        errors: [
          // https://jestjs.io/docs/en/expect#expectobjectcontainingobject
          expect.objectContaining({message: "Not Authorised!"})
        ],
        data: {
          write: null,
        },
      });
    });


    it("responds with created post", async () => {
      const { query, mutate } = createTestClient(serverAuthorized);
      await expect(action(mutate)).resolves.toMatchObject({
        errors: undefined,
        data: {
          write: {
            title: "Some post",
            id: expect.any(String),
          },
        },
      });
    });

    const UPVOTE_VOTE = gql`
      mutation($id: ID!) {
        upvote(id: $id) {
          votes
        }
      }
    `;

    const upvote = (id, mutate) =>
      mutate({
        mutation: UPVOTE_VOTE,
        variables: {
          id
        },
      });

    it("upvote a post", async () => {
      const postSample = {
        id: "1",
        title: "Ein Toller Title",
        user: "58334916-ae55-4149-add5-0bc11f1b43c6",
        voters: [],
      };
      postDb.posts = [postSample];
      expect(postDb.posts.length).toBe(1);
      expect(postDb.posts[0].voters.length).toBe(0);

      const { query, mutate } = createTestClient(serverAuthorized);

      const votes = await upvote("7ed8828b-f4de-4359-8160-1df1ff3234cd", mutate);

      console.log("\n\n\n\n\n", votes);
      expect(votes.data.upvote.votes).toBe(1);
    });
  });
});
