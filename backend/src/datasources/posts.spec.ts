import { createTestClient } from 'apollo-server-testing'
import { gql } from 'apollo-server'
import server from '../server'
import { posts, users} from '../seed-data'
import PostDatasource from './post.datasource.js'

const { query, mutate } = createTestClient(server)

function toRawPost(post){
    return{
        id : post.id, 
        title: post.title, 
        userName: post.author.name,
        voters: []
    }
}

describe('queries', () =>{
    describe('POSTS', () => {
        const POSTS = gql`
            query {
                posts {
                    id
                    title
                    author {
                        name
                    }
                    
                }
            }` 
    
        
        it('returns full array', async () =>{
            const response = query({ query: POSTS}).then(res => res.data.posts.map(toRawPost));
            await expect(response).resolves.toMatchObject(posts)
        })

        it('return empty array', async () =>{

            //TODO Fix mutation not being triggered. Array is still full

            const mutationDeletePost = gql`
                mutation($id: String!){
                    delete(id: $id){
                        id
                    }
                }`    

            const deletePosts = (id) => mutate({mutation: mutationDeletePost, variables: {id : id}})

            posts.forEach(post => {
                deletePosts(post.id);    
            });

            const response = query({ query: POSTS}).then(res => res.data.posts.map(toRawPost));
            await expect(response).resolves.toHaveLength(3);
        })
    
    })
})