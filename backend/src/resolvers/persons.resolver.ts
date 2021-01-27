import { AuthenticationError, UserInputError } from "apollo-server";
import { GraphQLSchema } from "graphql";
import { SigninDto } from "../dtos/signin.dto";
import { SignupDto } from "../dtos/signup.dto";
import { JwtPayload } from "../jwt-payload";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Executor } from "@graphql-tools/delegate/types";
import Person from "../entities/person.entity";
import PersonsDatasource from "../datasources/persons.datasource";

export function query(subSchemas: GraphQLSchema[], executor: Executor) {
  return {};
}

export function properties(subSchemas: GraphQLSchema[], executor: Executor) {
  return {};
}

export function mutation(subSchemas: GraphQLSchema[], executor: Executor) {
  return {
    async signup(parent, args: SignupDto, context, info) {
      const { name, email, password } = args;
      const personsDatasource: PersonsDatasource =
        context.dataSources.personsDatasource;

      const passwordSalt = await bcrypt.genSalt(
        parseInt(process.env.SALT_ROUNDS)
      );

      const passwordHash = await bcrypt.hash(password, passwordSalt);

      if (password.length < 8) {
        throw new UserInputError("Password must at least 8 characters long");
      }

      const result = await personsDatasource.createPerson(
        name,
        email,
        passwordHash,
        passwordSalt
      );

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const person: Partial<Person> = result.data.person;
        const payload: JwtPayload = {
          id: person.id,
          name: person.name,
          email: person.email,
        };

        return jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
      }
    },

    async login(parent, args: SigninDto, context, info) {
      const personsDatasource: PersonsDatasource =
        context.dataSources.personsDatasource;

      const { email, password } = args;
      const result = await personsDatasource.queryPersonByEmail(email);

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const person: Partial<Person> = result.data.person;

        if (!person) {
          throw new AuthenticationError("Wrong credentials");
        }

        const hash = await bcrypt.hash(password, person.passwordSalt);

        if (hash === result.data.person.passwordHash) {
          const payload: JwtPayload = {
            id: person.id,
            name: person.name,
            email: person.email,
          };

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
