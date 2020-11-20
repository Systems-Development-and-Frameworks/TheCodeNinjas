import { ApolloServer } from 'apollo-server';
import typeDefs from './typedefs';
import resolvers from './resolvers';
import dataSources from './datasources';

const context = ({ req, res }) => ({ req, res });

export default class ServerInitializer {
    defaults : any;

    constructor() {
      this.defaults = {
        typeDefs,
        resolvers,
        dataSources: () => dataSources,
        context,
      };
    }

    // return new ApolloServer({ ...this.defaults, ...opts });

    createServer(otherDb : any = {}, opts : any = {}) {
      return new ApolloServer({ ...{ ...this.defaults, ...otherDb }, ...opts });
    }
}
