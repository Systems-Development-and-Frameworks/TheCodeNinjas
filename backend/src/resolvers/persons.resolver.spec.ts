import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import PostsDatasource from "../datasources/posts.datasource";
import PersonsDatasource from "../datasources/persons.datasource";
import ServerInitializer from "../server-initializer";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../jwt-payload";
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
      postDatasource: new PostsDatasource(null, null),
      personDatasource: new PersonsDatasource(null, null),
    }),
  },
  createGraphCmsSchema,
  executor
);

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
      // postDatasource.reset();
      // personDatasource.reset();
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

      // expect(personDatasource.persons).toHaveLength(3);
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

      // expect(personDatasource.persons).toHaveLength(3);
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

      // expect(personDatasource.persons).toHaveLength(4);
    });
  });
});
