import { allow, deny, rule, shield } from "graphql-shield";
import { JwtPayload } from "./jwt-payload";
import { GraphQLSchema } from "graphql";
import { ForbiddenError, gql, UserInputError } from "apollo-server";
import Post from "./entities/post.entity";

export default function createPermissions(
  subSchemas: GraphQLSchema[],
  executor: any
) {
  const isAuthenticated = rule({ cache: "contextual" })(
    async (parent, args, ctx) => {
      return ctx.user !== null;
    }
  );

  const isOwner = rule({ cache: "no_cache" })(async (parent, args, ctx) => {
    if (ctx.user !== null) {
      const jwtPayload: JwtPayload = ctx.user;

      const query = gql`
        query($postId: ID!) {
          post(where: { id: $postId }) {
            author {
              id
            }
          }
        }
      `;

      const result = await executor({
        document: query,
        variables: { postId: args.id },
      });

      if (result.errors) {
        throw new UserInputError(
          result.errors.map((error) => error.message).join("\n")
        );
      } else {
        const post: Partial<Post> = result.data.post;

        if (post) {
          return post.author.id === jwtPayload.id;
        }
      }
    }

    return false;
  });

  return shield(
    {
      Query: {
        "*": deny,
        post: allow,
        posts: allow,
        person: allow,
        persons: allow,
      },
      Person: {
        createdAt: deny,
        updatedAt: deny,
        publishedAt: deny,
      },
      Post: {
        voters: deny,
        createdAt: deny,
        updatedAt: deny,
        publishedAt: deny,
      },
      Mutation: {
        "*": deny,
        login: allow,
        signup: allow,
        downvote: isAuthenticated,
        upvote: isAuthenticated,
        write: isAuthenticated,
        delete: isOwner,
      },
    },
    {
      allowExternalErrors: true,
      fallbackRule: allow,
      fallbackError: new ForbiddenError("No access allowed!"),
    }
  );
}
