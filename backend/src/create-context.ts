import * as jwt from "jsonwebtoken";
import { JwtPayload } from "./jwt-payload";
import { GraphQLSchema } from "graphql";
import PostsDatasource from "./datasources/posts.datasource";
import PersonsDatasource from "./datasources/persons.datasource";

export interface Context {
  user?: JwtPayload;
  subSchemas: GraphQLSchema[];
  dataSources: {
    postDatasource: PostsDatasource;
    personDatasource: PersonsDatasource;
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
