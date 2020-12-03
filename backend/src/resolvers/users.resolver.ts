import { SignupDto } from "../dtos/signup.dto";
import UserDatasource from "../datasources/user.datasource";
import { AuthenticationError, UserInputError } from "apollo-server";
import { JwtPayload } from "../jwt-payload";
import * as jwt from "jsonwebtoken";
import { SigninDto } from "../dtos/signin.dto";
import * as bcrypt from "bcrypt";
import User from "../entities/user.entity";
import PostDatasource from "../datasources/post.datasource";

export const query = {
  users: async (_source, _args, ctx) => {
    const { userDatasource } = ctx.dataSources;

    return userDatasource.getUsers();
  },
};

export const properties = {
  posts: async (parent: User, _args, ctx) => {
    const postDatasource: PostDatasource = ctx.dataSources.postDatasource;
    return postDatasource.getPostsByUser(parent.id);
  },
};

export const mutation = {
  // signup(name: String!, email: String!, password: String!): String
  async signup(_, args: SignupDto, ctx) {
    const { name, email, password } = args;
    const userDatasource: UserDatasource = ctx.dataSources.userDatasource;
    const existentUser = await userDatasource.getUserByEmail(email);

    console.log(args);

    if (password.length < 8) {
      throw new UserInputError("Password must at least 8 characters long");
    }

    console.log("passwort stimmt");

    if (existentUser) {
      throw new UserInputError("E-Mail does already exists");
    }

    console.log("user does not exist");

    const user = await userDatasource.createUser({ name, email }, password);
    console.log("user jetzt in db");

    const payload: JwtPayload = { id: user.id };

    console.log("payload", payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    console.log("token", token);
    return token;
  },
  // login(email: String!, password: String!): String
  async login(_, args: SigninDto, ctx) {
    const { email, password } = args;
    const userDatasource: UserDatasource = ctx.dataSources.userDatasource;
    const user = await userDatasource.getUserByEmail(email);

    if (!user) {
      throw new AuthenticationError("Wrong credentials");
    }

    const hash = await bcrypt.hash(password, user.passwordSalt);

    if (hash === user.passwordHash) {
      const payload: JwtPayload = { id: user.id };
      return jwt.sign(payload, process.env.JWT_SECRET);
    } else {
      throw new AuthenticationError("Wrong credentials");
    }
  },
};
