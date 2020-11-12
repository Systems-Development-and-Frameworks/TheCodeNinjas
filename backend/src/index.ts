import { ApolloServer, gql } from 'apollo-server';
import { importSchema } from 'graphql-import';
import PostDatasource from './datasources/post.datasource';
import UserDatasource from './datasources/user.datasource';


const typeDefs = gql(importSchema('src/schema.graphql'));
const resolvers = {
    Query: {
        posts: async (_source, _args, context) => {
            const postDatasource: PostDatasource = context.dataSources.postDatasource;

            return postDatasource.getPosts();
        },
        users: async (_source, _args, context) => {
            const userDatasource: UserDatasource = context.dataSources.userDatasource;

            return userDatasource.getUsers();
        }
    }
};

const dataSources = {
    postDatasource: new PostDatasource(),
    userDatasource: new UserDatasource()
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return dataSources;
    }
});


server.listen({ port: 1337 }).then(() => {
    console.log('Server is running on http://localhost:1337');
});
