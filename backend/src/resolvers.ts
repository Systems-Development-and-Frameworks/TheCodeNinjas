import Post from "./entities/post.entity";
import User from "./entities/user.entity";
import * as jwt from "jsonwebtoken";

import { UserInputError, AuthenticationError } from "apollo-server";
import UserDatasource from "./datasources/user.datasource";
import { SignupDto } from "./dtos/signup.dto";
import { SigninDto } from "./dtos/signin.dto";

import * as bcrypt from "bcrypt";
import has = Reflect.has;

const resolvers = {
  Query: {
    posts: async (_source, _args, context) => {
      const { postDatasource } = context.dataSources;
      return (await postDatasource.getPosts()).map((post) => ({
        ...post,
        votes: post.voters.length,
      }));
    },
    users: async (_source, _args, context) => {
      const { userDatasource } = context.dataSources;

      return userDatasource.getUsers();
    },
  },
  Mutation: {
    // signup(name: String!, email: String!, password: String!): String
    async signup(_, args: SignupDto, context) {
      const { name, email, password } = args;
      const userDatasource: UserDatasource = context.dataSources.userDatasource;
      const existentUser = await userDatasource.getUserByEmail(email);

      if (password.length < 8) {
        throw new UserInputError("Password must at least 8 characters long");
      }

      if (existentUser) {
        throw new UserInputError("E-Mail does already exists");
      }

      const user = await userDatasource.createUser({ name, email }, password);
      return jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    },
    // login(email: String!, password: String!): String
    async login(_, args: SigninDto, context) {
      const { email, password } = args;
      const userDatasource: UserDatasource = context.dataSources.userDatasource;
      const user = await userDatasource.getUserByEmail(email);

      if (!user) {
        throw new AuthenticationError("Wrong credentials");
      }

      const hash = await bcrypt.hash(password, user.passwordSalt);

      if (hash === user.passwordHash) {
        return jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      } else {
        throw new AuthenticationError("Wrong credentials");
      }
    },
    write: async (_, args, context) => {
      const post: Partial<Post> = {
        title: args.post.title,
        user: args.post.author.id,
      };

      const { postDatasource } = context.dataSources;
      return postDatasource.createPost(post).then((p) => ({
        ...p,
        votes: p.voters.length,
      }));
    },
    delete: async (_, args, context) => {
      const { postDatasource } = context.dataSources;
      return postDatasource.deletePost(args.id).then((p) => ({
        ...p,
        votes: p.voters.length,
      }));
    },
    upvote: async (_, args, context) => {
      const id = args.id;
      const voter = args.voter;
      const postDatasource = context.dataSources.postDatasource;
      const post = await postDatasource.getPost(id);

      if (!post.voters.includes(voter)) {
        post.voters = [...post.voters, voter];
      }

      return postDatasource.updatePost(id, post).then((p) => ({
        ...p,
        votes: p.voters.length,
      }));
    },
    downvote: async (_, args, context) => {
      const id = args.id;
      const voter = args.voter;
      const postDatasource = context.dataSources.postDatasource;
      const post = await postDatasource.getPost(id);

      post.voters = post.voters.filter((v) => v !== voter);

      return postDatasource.updatePost(id, post).then((p) => ({
        ...p,
        votes: p.voters.length,
      }));
    },
  },
  User: {
    posts: async (parent: User, _args, context) =>
      context.dataSources.postDatasource.getPostsByUser(parent.id),
  },
  Post: {
    author: async (parent: Post, _args, context) => {
      const { userDatasource } = context.dataSources;
      return await userDatasource.getUser(parent.id);
    },
  },
};

export default resolvers;
