import ServerInitializer from "./server-initializer";

const serverInitializer: ServerInitializer = new ServerInitializer();
const server = serverInitializer.createServer();

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
