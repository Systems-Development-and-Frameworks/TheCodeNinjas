import {
  mutation as postsMutation,
  properties as postsProperties,
  query as postsQuery,
} from "./resolvers/posts.resolver";
import {
  mutation as usersMutation,
  properties as usersProperties,
  query as usersQuery,
} from "./resolvers/users.resolver";

const resolvers = {
  Query: {
    ...postsQuery,
    ...usersQuery,
  },
  Mutation: {
    ...usersMutation,
    ...postsMutation,
  },
  Post: postsProperties,
  User: usersProperties,
};

export default resolvers;
