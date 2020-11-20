import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server';
import * as uuid from 'uuid';
import ServerInitializer from '../serverInitializer';
import { posts, users } from '../seed-data';
import dataSources from '../datasources';
import PostDatasource from './post.datasource';
import Post from '../entities/post.entity';
import UserDatasource from './user.datasource';

let postDb = new PostDatasource();
const userDb = new UserDatasource();
const dataSource = { postDatasource: postDb, userDatasource: userDb };
userDb.users = users;
postDb.posts = [];

const serverInitilizer = new ServerInitializer();
const server = serverInitilizer.createServer({ dataSources: () => dataSource });

const { query, mutate } = createTestClient(server);

describe('queries', () => {
  describe('POSTS', () => {
    const POSTS = gql`
        query {
            posts {
            id
            title
            }
        }
        `;

    it('returns empty array', async () => {
      await expect(query({ query: POSTS }))
        .resolves.toMatchObject({
          errors: undefined,
          data: { posts: [] },
        });
    });

    describe('given posts in the database', () => {
      beforeEach(() => {
        postDb.posts = [
          {
            id: '1', // uuid.v4(),
            title: 'Ein Toller Title',
            voters: [],
            userName: 'Christoph Stach',
          },
        ];
      });

      it('returns posts', async () => {
        await expect(query({ query: POSTS }))
          .resolves
          .toMatchObject({
            errors: undefined,
            data: {
              posts: [
                {
                  id: '1',
                  title: 'Ein Toller Title',
                },
              ],
            },
          });
      });
    });
  });
  describe('USERS', () => {
    const USERS = gql`
        query {
            users {
                name
            }
        }
        `;

    it('returns all users', async () => {
      await expect(query({ query: USERS }))
        .resolves.toMatchObject({
          errors: undefined,
          data: { users },
        });
    });
  });
});

describe('mutations', () => {
  beforeEach(() => {
    postDb = new PostDatasource();
  });

  describe('WRITE_POST', () => {
    const action = () => mutate({
      mutation: WRITE_POST,
      variables: {
        post: {
          title: 'Some post',
          author: {
            name: 'Some author',
          },
        },
      },

    });
    const WRITE_POST = gql`
        mutation($post: PostInput!){
            write(post: $post){
              id
              title
            }
          }
        `;
    it('responds with created post', async () => {
      // mutation{
      //     write(post: {
      //         title: "test1",
      //         author: {
      //         name: "test1"
      //         }
      //     }){
      //         id
      //     }
      //     }

      await expect(action())
        .resolves
        .toMatchObject({
          errors: undefined,
          data: {
            write: {
              title: 'Some post',
              id: expect.any(String),
            },
          },
        });
    });

    const UPVOTE_VOTE = gql`
            mutation($id: ID!, $voter: UserInput!){
                upvote(id: $id, voter: $voter){
                    votes
                }
            }
        `;
    const upvote = (id, name) => mutate({
      mutation: UPVOTE_VOTE,
      variables: {
        id,
        voter: {
          name,
        },
      },
    });

    it('upvote a post', async () => {
      // mutation{
      //     upvote(id: "0903cadb-1330-4980-b117-cc54888eae54", voter: {
      //       name: "Christoph Stach"
      //     })
      //     {
      //       id
      //       title
      //     }
      //   }

      const postSample = {
        id: '1',
        title: 'Ein Toller Title',
        voters: [],
        userName: 'Christoph Stach',
      };
      postDb.posts = [postSample];
      expect(postDb.posts.length).toBe(1);
      expect(postDb.posts[0].voters.length).toBe(0);

      const votes = await upvote(postSample.id, postSample.userName);

      expect(votes.data.upvote.votes).toBe(1);
    });
  });
});