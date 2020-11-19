import PostDatasource from "./datasources/post.datasource";
import UserDatasource from "./datasources/user.datasource";
import Post from "./entities/post.entity";
import User from "./entities/user.entity";

const resolvers = {
    Query: {
        posts: async (_source, _args, context) => {
            const postDatasource: PostDatasource = context.dataSources.postDatasource;

            return (await postDatasource.getPosts()).map(post => {
                return {
                    ...post, votes:post.voters.length   
            }});
        },
        users: async (_source, _args, context) => {
            const userDatasource: UserDatasource = context.dataSources.userDatasource;

            return userDatasource.getUsers();
        }
    }, 
    Mutation: {
        write: async(_, args, context) => {
            const post : Partial<Post> = {
                title: args.post.title,
                userName: args.post.author.name
            }

            const postDatasource: PostDatasource = context.dataSources.postDatasource;
            return postDatasource.createPost(post).then(p => { 
                return {
                    ...p, votes: p.voters.length
                }
            });
        }, 
        delete: async(_, args, context) => {
            const postDatasource: PostDatasource = context.dataSources.postDatasource;
            return postDatasource.deletePost(args.id).then(p => { 
                return {
                    ...p, votes: p.voters.length
                }
            });
        }, 
        upvote: async(_, args, context) => {
            const postDatasource: PostDatasource = context.dataSources.postDatasource;
            
            const post = await postDatasource.getPost(args.id);
            if(!post.voters.includes(args.voter.name)){
                post.voters = [...post.voters, args.voter.name]
            }
            return postDatasource.updatePost(args.id, post).then(p => { 
                return {
                    ...p, votes: p.voters.length
                }
            });
        }, 
        downvote: async(_, args, context) => {
            const postDatasource: PostDatasource = context.dataSources.postDatasource;
            
            const post = await postDatasource.getPost(args.id);
            post.voters = post.voters.filter(voter => voter !== args.voter.name)
            
            return postDatasource.updatePost(args.id, post).then(p => { 
                return {
                    ...p, votes: p.voters.length
                }
            });;
        }
    },
    User: {
        posts: async (parent : User, _args, context) => {
            const postDatasource: PostDatasource = context.dataSources.postDatasource;
            
            return postDatasource.getPostsByUser(parent.name);    
        }
    }, 
    Post: {
        author: async (parent : Post, _args, context) => {
            const userDatasource: UserDatasource = context.dataSources.userDatasource;
            return await userDatasource.getUser(parent.userName);
        }
    }
};

export default resolvers;