import * as dotenv from "dotenv";
import ServerInitializer from "./server-initializer";

dotenv.config();

const serverInitializer: ServerInitializer = new ServerInitializer();

serverInitializer.createServer().then((server) => {
  server.listen({ port: process.env.PORT }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
});
