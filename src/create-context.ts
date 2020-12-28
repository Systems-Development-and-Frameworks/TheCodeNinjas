import * as jwt from "jsonwebtoken";
import { JwtPayload } from "./jwt-payload";
import { GraphQLSchema } from "graphql";
import PostDatasource from "./datasources/post.datasource";
import PersonDatasource from "./datasources/person.datasource";

export interface Context {
  user?: JwtPayload;
  subSchemas: GraphQLSchema[];
  dataSources: {
    postDatasource: PostDatasource;
    personDatasource: PersonDatasource;
  };
}

export default function createContext() {
  const context: Partial<Context> = {
    user: null,
  };

  return ({ req }) => {
    try {
      const { headers } = req;
      const auth = headers["authorization"];
      const token = auth.replace("Bearer ", "");

      context.user = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    } catch (e) {}

    return context;
  };
}