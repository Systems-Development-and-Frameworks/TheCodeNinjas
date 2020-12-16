import { allow, rule, shield } from "graphql-shield";
import PostDatasource from "./datasources/post.datasource";
import { JwtPayload } from "./jwt-payload";

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx) => {
    return ctx.user !== null;
  }
);

const isPostAuthor = rule({ cache: "contextual" })(
  async (parent, args, ctx) => {
    if (ctx.user !== null) {
      const jwtPayload: JwtPayload = ctx.user;
      const postDatasource: PostDatasource = ctx.dataSources.postDatasource;
      const post = await postDatasource.getPost(args.id);

      if (post) {
        return post.user === jwtPayload.id;
      }
    }

    return false;
  }
);

const permissions = shield({
  Query: {},
  Mutation: {
    signup: allow,
    downvote: isAuthenticated,
    upvote: isAuthenticated,
  },
}, {allowExternalErrors: true});

export default permissions;
