<template>
  <div>
    <h1 class="uk-heading-xlarge uk-text-center">News List</h1>

    <hr />

    <div class="news-items-wrapper">
      <table class="uk-table uk-table-striped uk-table-medium uk-table-middle">
        <thead>
          <tr>
            <th class="uk-table-shrink">Id</th>
            <th class="uk-table-expand">Title</th>
            <th class="uk-table-shrink uk-text-nowrap">
              Votes
              <button
                class="uk-button uk-button-default"
                data-test-toggle
                aria-label="Sort"
                @click="toggleSortOrder"
              >
                <i
                  v-if="sortDescending"
                  class="mdi mdi-18px mdi-sort-ascending"
                  aria-hidden="true"
                ></i>
                <i
                  v-else
                  class="mdi mdi-18px mdi-sort-descending"
                  aria-hidden="true"
                ></i>
              </button>
            </th>
            <th v-if="loggedIn" colspan="3" class="uk-table-shrink"></th>
          </tr>
        </thead>
        <tbody v-if="hasNewsItems">
          <news-item
            v-for="item in newsItemsSorted"
            :key="item.id"
            :news-item="item"
            :login="loggedIn"
            :is-owner="!!(user && user.id === item.author.id)"
            @upvote="upvote"
            @downvote="downvote"
            @remove="removeNewsItem"
          />
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="uk-text-center">No News in the list!</td>
          </tr>
        </tbody>
      </table>
    </div>

    <form
      v-if="loggedIn"
      class="uk-form-large"
      @submit.prevent="createNewsItem"
    >
      <div class="uk-flex uk-flex-bottom">
        <div class="uk-flex-1 uk-margin">
          <label class="uk-form-label" for="news-title-input">Title</label>

          <div class="uk-form-controls">
            <input
              id="news-title-input"
              v-model="newsTitle"
              class="uk-input"
              placeholder="Please enter title"
            />
          </div>
        </div>
        <div class="uk-margin">
          <button type="submit" class="uk-button uk-button-primary">
            Create
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import NewsItem from '../../components/NewsItem/NewsItem.vue'
import { NewsItemModel, NewsItemProperties } from '~/models/news-item.model'

const GET_POSTS = gql`
  query {
    posts {
      id
      title
      votes
      author {
        id
      }
    }
  }
`

const UPVOTE = gql`
  mutation($postId: ID!) {
    upvote(id: $postId) {
      id
      title
      votes
      author {
        id
      }
    }
  }
`

const DOWNVOTE = gql`
  mutation($postId: ID!) {
    downvote(id: $postId) {
      id
      title
      votes
      author {
        id
      }
    }
  }
`

const WRITE = gql`
  mutation($title: String!) {
    write(title: $title) {
      id
      title
      votes
      author {
        id
      }
    }
  }
`

const DELETE = gql`
  mutation($postId: ID!) {
    delete(id: $postId) {
      id
      title
      votes
      author {
        id
      }
    }
  }
`

export default Vue.extend({
  name: 'NewsList',
  components: {
    NewsItem,
  },
  apollo: {
    newsItems: {
      query: GET_POSTS,
      update(data) {
        return data.posts.map(
          (post: NewsItemProperties) => new NewsItemModel(post)
        )
      },
    },
  },
  data() {
    return {
      sortDescending: true,
      currentId: 3,
      newsTitle: '',
      newsItems: [] as NewsItemModel[],
    }
  },
  computed: {
    user() {
      return this.$accessor.auth.user
    },
    loggedIn() {
      return this.$accessor.auth.loggedIn
    },
    hasNewsItems(): boolean {
      return this.newsItems.length > 0
    },
    newsItemsSorted(): NewsItemModel[] {
      if (this.sortDescending) {
        return [...this.newsItems].sort((a, b) => a.compareToDescending(b))
      } else {
        return [...this.newsItems].sort((a, b) => a.compareToAscending(b))
      }
    },
  },
  methods: {
    toggleSortOrder() {
      this.sortDescending = !this.sortDescending
    },
    async upvote(newsItem: NewsItemProperties) {
      try {
        await this.$apollo.mutate({
          mutation: UPVOTE,
          optimisticResponse: {
            upvote: {
              id: newsItem.id,
              title: newsItem.title,
              votes: newsItem.votes + 1,
              author: {
                id: newsItem.author?.id,
                __typename: 'Person',
              },
              __typename: 'Post',
            },
          },
          update: (store, response) => {
            if (response.data) {
              const remotePost = response.data.upvote
              const data = store.readQuery<{ posts: { id: string }[] }>({
                query: GET_POSTS,
              })

              store.writeQuery({
                query: GET_POSTS,
                data: {
                  posts: data?.posts.map((post) => {
                    if (remotePost.id === post.id) {
                      return remotePost
                    } else {
                      return post
                    }
                  }),
                },
              })
            }
          },
          variables: {
            postId: newsItem.id,
          },
        })
      } catch (e) {
        alert(e)
      }
    },
    async downvote(newsItem: NewsItemProperties) {
      try {
        await this.$apollo.mutate({
          mutation: DOWNVOTE,
          optimisticResponse: {
            downvote: {
              id: newsItem.id,
              title: newsItem.title,
              votes: newsItem.votes > 0 ? newsItem.votes - 1 : 0,
              author: {
                id: newsItem.author?.id,
                __typename: 'Person',
              },
              __typename: 'Post',
            },
          },
          update: (store, response) => {
            if (response.data) {
              const remotePost = response.data.downvote
              const data = store.readQuery<{ posts: { id: string }[] }>({
                query: GET_POSTS,
              })

              store.writeQuery({
                query: GET_POSTS,
                data: {
                  posts: data?.posts.map((post) => {
                    if (remotePost.id === post.id) {
                      return remotePost
                    } else {
                      return post
                    }
                  }),
                },
              })
            }
          },
          variables: {
            postId: newsItem.id,
          },
        })
      } catch (e) {
        alert(e)
      }
    },
    async removeNewsItem(newsItem: NewsItemProperties) {
      try {
        await this.$apollo.mutate({
          mutation: DELETE,
          optimisticResponse: {
            delete: {
              id: newsItem.id,
              title: newsItem.title,
              votes: newsItem.votes,
              author: {
                id: newsItem.author?.id,
                __typename: 'Person',
              },
              __typename: 'Post',
            },
          },
          update: (store, response) => {
            if (response.data) {
              const remotePost = response.data.delete
              const data = store.readQuery<{ posts: { id: string }[] }>({
                query: GET_POSTS,
              })

              store.writeQuery({
                query: GET_POSTS,
                data: {
                  posts: data?.posts.filter(
                    (post) => post.id !== remotePost.id
                  ),
                },
              })
            }
          },
          variables: {
            postId: newsItem.id,
          },
        })
      } catch (e) {
        alert(e)
      }
    },
    async createNewsItem() {
      try {
        const title = this.newsTitle

        await this.$apollo.mutate({
          mutation: WRITE,
          variables: {
            title,
          },
          optimisticResponse: {
            write: {
              id: null,
              title,
              votes: 0,
              author: {
                id: this.user?.id,
                __typename: 'Person',
              },
              __typename: 'Post',
            },
          },
          update: (store, response) => {
            if (response.data) {
              const remotePost = response.data.write
              const data = store.readQuery<{ posts: object[] }>({
                query: GET_POSTS,
              })

              data?.posts.push(remotePost)

              store.writeQuery({
                query: GET_POSTS,
                data,
              })

              this.newsTitle = ''
            }
          },
        })
      } catch (error) {
        alert(error)
      }
    },
  },
})
</script>

<style scoped>
th {
  color: #000000;
}

.uk-button-primary {
  background-color: #0000ff;
}
</style>
