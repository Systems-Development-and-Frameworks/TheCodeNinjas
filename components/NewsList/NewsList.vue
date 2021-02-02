<template>
  <client-only>
    <v-form v-if="isLoggedIn" @submit.prevent="createNewsItem">
      <div class="d-flex align-center">
        <v-text-field
          id="news-title-input"
          v-model="newsTitle"
          type="text"
          placeholder="Please enter title"
        ></v-text-field>

        <v-btn
          color="primary"
          class="mx-4"
          type="submit"
          :disabled="loading > 0"
          :loading="loading > 0"
        >
          Create
        </v-btn>

        <v-btn
          :disabled="loading > 0"
          :loading="loading > 0"
          @click="toggleSortOrder"
        >
          <v-icon v-if="sortDescending">mdi-sort-ascending</v-icon>
          <v-icon v-else>mdi-sort-descending</v-icon>
        </v-btn>
      </div>
    </v-form>

    <div v-if="loading > 0" class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <v-row v-else>
      <news-item
        v-for="item in newsItemsSorted"
        :key="item.id"
        :news-item="item"
        :login="isLoggedIn"
        :is-owner="!!(user && user.id === item.author.id)"
        @upvote="upvote"
        @downvote="downvote"
        @remove="removeNewsItem"
      />
    </v-row>
  </client-only>
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
  components: {},
  apollo: {
    $loadingKey: 'loading',
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
      loading: 0,
      sortDescending: true,
      newsTitle: '',
      newsItems: [] as NewsItemModel[],
    }
  },
  computed: {
    user() {
      return this.$accessor.auth.user
    },
    isLoggedIn() {
      return this.$accessor.auth.isLoggedIn
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
