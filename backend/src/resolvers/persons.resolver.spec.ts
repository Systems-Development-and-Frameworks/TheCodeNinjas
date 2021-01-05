import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import PostDatasource from "../datasources/post.datasource";
import PersonDatasource from "../datasources/person.datasource";
import { posts, persons } from "../test-data";
import ServerInitializer from "../server-initializer";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../jwt-payload";

dotenv.config();

const postDatasource = new PostDatasource(posts);
const personDatasource = new PersonDatasource(persons);
const dataSource = {
  postDatasource: postDatasource,
  personDatasource: personDatasource,
};

const serverInitializer = new ServerInitializer();
const serverUnauthorized = serverInitializer.createServer({
  dataSources: () => dataSource,
});

describe("queries", () => {
  describe("PERSONS", () => {
    const PERSONS = gql`
      query {
        persons {
          id
          email
          name
        }
      }
    `;

    const action = (query) => {
      return query({ query: PERSONS });
    };

    beforeEach(() => {
      postDatasource.reset();
      personDatasource.reset();
    });

    it("should return seeded persons", async () => {
      const { query } = createTestClient(await serverUnauthorized);
      const response = action(query);

      await expect(response).resolves.toMatchObject({
        errors: undefined,
        data: {
          persons: [
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
  describe("LOGIN", () => {
    const LOGIN = gql`
      mutation($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `;

    const action = (email, password, mutate) => {
      return mutate({
        mutation: LOGIN,
        variables: {
          email,
          password,
        },
      });
    };

    beforeEach(() => {
      postDatasource.reset();
      personDatasource.reset();
    });

    it("should not login with wrong person", async () => {
      const { mutate } = createTestClient(await serverUnauthorized);
      const response = await action(
        "s0555912@htw-berlin.de",
        "__WRONG_PASSWORD__",
        mutate
      );

      expect(response).toMatchObject({
        errors: [expect.objectContaining({ message: "Not Authorised!" })],
        data: {
          login: null,
        },
      });
    });

    it("should login with valid person", async () => {
      const { mutate } = createTestClient(await serverUnauthorized);
      const response = await action(
        "s0555912@htw-berlin.de",
        "chrisPW",
        mutate
      );

      expect(response).toMatchObject({
        data: {
          login: expect.any(String),
        },
      });

      expect(() => {
        const payload = jwt.verify(
          response.data.login,
          process.env.JWT_SECRET
        ) as JwtPayload;

        expect(payload.id).toBe("58334916-ae55-4149-add5-0bc11f1b43c6");
      }).not.toThrowError();
    });
  });

  describe("SIGNUP", () => {
    const SIGNUP = gql`
      mutation($name: String!, $email: String!, $password: String!) {
        signup(name: $name, email: $email, password: $password)
      }
    `;

    const action = (name, email, password, mutate) => {
      return mutate({
        mutation: SIGNUP,
        variables: {
          name,
          email,
          password,
        },
      });
    };

    beforeEach(() => {
      postDatasource.reset();
      personDatasource.reset();
    });

    it("should not signup if email of person already exists", async () => {
      const { mutate } = createTestClient(await serverUnauthorized);
      const response = await action(
        "Christoph Stach",
        "s0555912@htw-berlin.de",
        "1234567890",
        mutate
      );

      expect(response).toMatchObject({
        errors: [expect.objectContaining({ message: "Not Authorised!" })],
        data: {
          signup: null,
        },
      });

      expect(personDatasource.persons).toHaveLength(3);
    });

    it("should not signup if password is to short", async () => {
      const { mutate } = createTestClient(await serverUnauthorized);
      const response = await action(
        "Christoph Stach",
        "notexistingmail@htw-berlin.de",
        "12345",
        mutate
      );

      expect(response).toMatchObject({
        errors: [expect.objectContaining({ message: "Not Authorised!" })],
        data: {
          signup: null,
        },
      });

      expect(personDatasource.persons).toHaveLength(3);
    });

    it("it should signup a new person", async () => {
      const { mutate } = createTestClient(await serverUnauthorized);
      const response = await action(
        "Christoph Stach",
        "notexistingmail@htw-berlin.de",
        "1234567890",
        mutate
      );

      expect(response).toMatchObject({
        data: {
          signup: expect.any(String),
        },
      });

      expect(personDatasource.persons).toHaveLength(4);
    });
  });
});