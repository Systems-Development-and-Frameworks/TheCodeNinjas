import { rule, shield } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => ctx.user !== null
);

const permissions = shield({
  Query: {},
  Mutation: {
    downvote: isAuthenticated,
    upvote: isAuthenticated,
  },
});

export default permissions;
