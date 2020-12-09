import PostDatasource from "../datasources/post.datasource";
import { JwtPayload } from "../jwt-payload";
import Post from "../entities/post.entity";
import UserDatasource from "../datasources/user.datasource";

export const query = {
  posts: async (_source, _args, ctx) => {
    const postDatasource: PostDatasource = ctx.dataSources.postDatasource;
    const posts = await postDatasource.getPosts();

    return posts.map((post) => {
      return {
        ...post,
        votes: post.voters.length,
      };
    });
  },
};

export const properties = {
  author: async (parent: Post, _args, ctx) => {
    const userDatasource: UserDatasource = ctx.dataSources.userDatasource;
    return await userDatasource.getUser(parent.user);
  },
};

export const mutation = {
  write: async (_, args, ctx) => {
    const jwtPayload: JwtPayload = ctx.user;
    const postDatasource: PostDatasource = ctx.dataSources.postDatasource;
    const post: Partial<Post> = {
      title: args.post.title,
      user: jwtPayload.id,
    };

    return postDatasource.createPost(post).then((p) => ({
      ...p,
      votes: p.voters.length,
    }));
  },
  delete: async (_, args, ctx) => {
    const postDatasource: PostDatasource = ctx.dataSources.postDatasource;

    return postDatasource.deletePost(args.id).then((p) => ({
      ...p,
      votes: p.voters.length,
    }));
  },
  upvote: async (_, args, ctx) => {
    const jwtPayload: JwtPayload = ctx.user;
    const id = args.id;
    const voter = jwtPayload.id;
    const postDatasource = ctx.dataSources.postDatasource;
    const post = await postDatasource.getPost(id);

    if (!post.voters.includes(voter)) {
      post.voters = [...post.voters, voter];
    }

    return postDatasource.updatePost(id, post).then((p) => ({
      ...p,
      votes: p.voters.length,
    }));
  },
  downvote: async (_, args, ctx) => {
    const jwtPayload: JwtPayload = ctx.user;
    const id = args.id;
    const voter = jwtPayload.id;
    const postDatasource = ctx.dataSources.postDatasource;
    const post = await postDatasource.getPost(id);

    post.voters = post.voters.filter((v) => v !== voter);

    return postDatasource.updatePost(id, post).then((p) => ({
      ...p,
      votes: p.voters.length,
    }));
  },
};
