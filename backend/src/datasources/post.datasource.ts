import * as uuid from 'uuid';
import { DataSource } from 'apollo-datasource';
import Post from '../entities/post.entity';

export default class PostDatasource extends DataSource {
    private posts: Post[];

    constructor() {
        super();

        this.posts = [
            {
                id: uuid.v4(),
                title: "Ein Toller Title",
                voters: [], 
                userName: "Christoph Stach"
            },
            {
                id: uuid.v4(),
                title: "Phillips Post",
                voters: [], 
                userName: "Phillip"
            },
            {
                id: uuid.v4(),
                title: "Flos Post",
                voters: [], 
                userName: "Florian"
            }, 
            {
                id: uuid.v4(),
                title: "Noch ein Post",
                voters: [], 
                userName: "Florian"
            }
        ]
    }

    async getPosts() {
        return Promise.resolve(this.posts);
    }

    async getPost(id: string) {
        return Promise.resolve(this.posts.find(post => post.id === id));
    }

    async createPost(post: Partial<Post>) {
        const fullPost : Post = {
            id: uuid.v4(),
            title: post.title,
            voters: [], 
            userName: post.userName
        }

        this.posts = [... this.posts, fullPost]

        return Promise.resolve(fullPost);
    }

    async updatePost(id: string, post: Post) {
        const index = this.posts.findIndex(post => post.id === id);
        this.posts.splice(index, 1, post);

        return Promise.resolve(post);
    }

    async deletePost(id: string) {
        
        const index = this.posts.findIndex(post => post.id === id);
        const post = this.posts[index];
        this.posts.splice(index, 1);
        
        return Promise.resolve(post);
    }

    async getPostsByUser(name: string){
        return Promise.resolve(this.posts.filter(post => post.userName === name));
    }
}
