import { AuthenticationError, gql, UserInputError } from "apollo-server";
import { GraphQLError, GraphQLSchema } from "graphql";
import { SigninDto } from "../dtos/signin.dto";
import { SignupDto } from "../dtos/signup.dto";
import { JwtPayload } from "../jwt-payload";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Executor } from "@graphql-tools/delegate/types";
import User from "../entities/user.entity";

export function query(subSchemas: GraphQLSchema[]) {
  return {};
}

export function properties(subSchemas: GraphQLSchema[]) {
  return {};
}

export function mutation(subSchemas: GraphQLSchema[], executor: Executor) {
  return {
    async signup(parent, args: SignupDto, context, info) {
      const { name, email, password } = args;

      const passwordSalt = await bcrypt.genSalt(
        parseInt(process.env.SALT_ROUNDS)
      );

      const passwordHash = await bcrypt.hash(password, passwordSalt);

      if (password.length < 8) {
        throw new UserInputError("Password must at least 8 characters long");
      }

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

      const result = await executor({
        document: mutation,
        variables: {
          name,
          email,
          passwordHash,
          passwordSalt,
        },
      });

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const person: Partial<User> = result.data.person;
        const payload: JwtPayload = { id: result["id"] };

        return jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
      }
    },

    async login(parent, args: SigninDto, context, info) {
      const query = gql`
        query($email: String!) {
          person(where: { email: $email }) {
            id
            passwordHash
            passwordSalt
          }
        }
      `;
      const { email, password } = args;

      const result = await executor({
        document: query,
        variables: { email },
      });

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const person: Partial<User> = result.data.person;

        if (!person) {
          throw new AuthenticationError("Wrong credentials");
        }

        const hash = await bcrypt.hash(password, person.passwordSalt);

        if (hash === result.data.person.passwordHash) {
          const payload: JwtPayload = { id: result.data.person.id };

          return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
        } else {
          throw new AuthenticationError("Wrong credentials");
        }
      }
    },
  };
}
