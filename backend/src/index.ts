import * as dotenv from "dotenv";
import ServerInitializer from "./server-initializer";
import createGraphCmsSchema, {
  executor,
} from "./graph-cms/create-graph-cms-schema";

dotenv.config();

const serverInitializer: ServerInitializer = new ServerInitializer();

serverInitializer
  .createServer({}, createGraphCmsSchema, executor)
  .then((server) => {
    server.listen({ port: process.env.PORT }).then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  });
