import * as uuid from "uuid";
import { DataSource } from "apollo-datasource";
import Post from "../entities/post.entity";

export default class PostDatasource extends DataSource {
  seedPosts: Post[];
  posts: Post[];

  constructor(posts: Post[]) {
    super();

    this.posts = posts;
    this.seedPosts = posts;
  }

  getPosts(): Promise<Post[]> {
    return Promise.resolve(this.posts);
  }

  getPost(id: string): Promise<Post> {
    return Promise.resolve(this.posts.find((post) => post.id === id));
  }

  createPost(post: Partial<Post>): Promise<Post> {
    const fullPost: Post = {
      id: uuid.v4(),
      title: post.title,
      author: post.author,
      voters: [],
    };

    this.posts = [...this.posts, fullPost];

    return Promise.resolve(fullPost);
  }

  updatePost(id: string, post: Post): Promise<Post> {
    const index = this.posts.findIndex((post) => post.id === id);
    this.posts.splice(index, 1, post);

    return Promise.resolve(post);
  }

  deletePost(id: string): Promise<Post> {
    const index = this.posts.findIndex((post) => post.id === id);
    const post = this.posts[index];
    this.posts.splice(index, 1);

    return Promise.resolve(post);
  }

  getPostsByPerson(personId: string): Promise<Post[]> {
    return Promise.resolve(
      this.posts.filter((post) => post.author.id === personId)
    );
  }

  reset() {
    this.posts = this.seedPosts;
  }
}