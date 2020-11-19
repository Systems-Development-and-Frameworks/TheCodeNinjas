import { ApolloServer } from "apollo-server";
import typeDefs from "./typedefs"
import resolvers from "./resolvers"
import dataSources from "./datasources"

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return dataSources;
    }
});
export default server;