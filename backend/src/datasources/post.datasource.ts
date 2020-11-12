import Post from '../entities/post.entity';
import * as uuid from 'uuid'
import { DataSource } from 'apollo-datasource';

export default class PostDatasource extends DataSource{
    private posts: Post[];

    constructor() {
        super();

        this.posts = [
            {
                id: uuid.v4(),
                title: "Ein Toller Title",
                votes: 5
            },
            {
                id: uuid.v4(),
                title: "Phillips Post",
                votes: -5
            },
            {
                id: uuid.v4(),
                title: "Flos Post",
                votes: -50
            }
        ]
    }

    async getPosts() {
        return Promise.resolve(this.posts);
    }

    async getPost(id: string) {
        return Promise.resolve(this.posts.find(post => post.id == id));
    }

    async createPost(post: Post) {
    }

    async updatePost(id: string, post: Post) {
    }

    async deletePost(id: string) {

    }
}
