import Post from "./entities/post.entity";
import User from "./entities/user.entity";
import * as jwt from "jsonwebtoken";

import { AuthenticationError, UserInputError } from "apollo-server";
import UserDatasource from "./datasources/user.datasource";
import { SignupDto } from "./dtos/signup.dto";
import { SigninDto } from "./dtos/signin.dto";

import * as bcrypt from "bcrypt";
import { JwtPayload } from "./jwt-payload";
import PostDatasource from "./datasources/post.datasource";

const resolvers = {
  Query: {
    posts: async (_source, _args, ctx) => {
      const postDatasource: PostDatasource = ctx.dataSources.postDatasource;
      const posts = await postDatasource.getPosts();

      return posts.map((post) => {
        return {
          ...post,
          votes: post.voters.length,
        };
      });
    },
    users: async (_source, _args, ctx) => {
      const { userDatasource } = ctx.dataSources;

      return userDatasource.getUsers();
    },
  },
  Mutation: {
    // signup(name: String!, email: String!, password: String!): String
    async signup(_, args: SignupDto, ctx) {
      const { name, email, password } = args;
      const userDatasource: UserDatasource = ctx.dataSources.userDatasource;
      const existentUser = await userDatasource.getUserByEmail(email);

      if (password.length < 8) {
        throw new UserInputError("Password must at least 8 characters long");
      }

      if (existentUser) {
        throw new UserInputError("E-Mail does already exists");
      }

      const user = await userDatasource.createUser({ name, email }, password);
      const payload: JwtPayload = { id: user.id };
      return jwt.sign(payload, process.env.JWT_SECRET);
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
    write: async (_, args, ctx) => {
      const jwtPayload: JwtPayload = ctx.user;
      const postDatasource: PostDatasource = ctx.dataSources.postDatasource;
      const post: Partial<Post> = {
        title: args.post.title,
        user: jwtPayload.id,
      };

      return postDatasource.createPost(post).then((p) => ({
        ...p,
        votes: p.voters.length,
      }));
    },
    delete: async (_, args, ctx) => {
      const postDatasource: PostDatasource = ctx.dataSources.postDatasource;

      return postDatasource.deletePost(args.id).then((p) => ({
        ...p,
        votes: p.voters.length,
      }));
    },
    upvote: async (_, args, ctx) => {
      const jwtPayload: JwtPayload = ctx.user;
      const id = args.id;
      const voter = jwtPayload.id;
      const postDatasource = ctx.dataSources.postDatasource;
      const post = await postDatasource.getPost(id);

      if (!post.voters.includes(voter)) {
        post.voters = [...post.voters, voter];
      }

      return postDatasource.updatePost(id, post).then((p) => ({
        ...p,
        votes: p.voters.length,
      }));
    },
    downvote: async (_, args, ctx) => {
      const jwtPayload: JwtPayload = ctx.user;
      const id = args.id;
      const voter = jwtPayload.id;
      const postDatasource = ctx.dataSources.postDatasource;
      const post = await postDatasource.getPost(id);

      post.voters = post.voters.filter((v) => v !== voter);

      return postDatasource.updatePost(id, post).then((p) => ({
        ...p,
        votes: p.voters.length,
      }));
    },
  },
  User: {
    posts: async (parent: User, _args, ctx) => {
      const postDatasource: PostDatasource = ctx.dataSources.postDatasource;
      return postDatasource.getPostsByUser(parent.id);
    },
  },
  Post: {
    author: async (parent: Post, _args, ctx) => {
      const userDatasource: UserDatasource = ctx.dataSources.userDatasource;
      return await userDatasource.getUser(parent.user);
    },
  },
};

export default resolvers;
