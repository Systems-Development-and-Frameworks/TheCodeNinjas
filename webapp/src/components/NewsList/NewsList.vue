<template>
  <div class="uk-container uk-margin-top">
    <h1 class="uk-heading-xlarge uk-text-center">News List</h1>

    <hr />

    <div class="uk-flex uk-flex-center">
      <login-form @signIn="signIn" @signOut="signOut" :login="login" />
    </div>

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
                @click="toggleSortOrder"
                aria-label="Sort"
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
            <th colspan="3" class="uk-table-shrink" v-if="login"></th>
          </tr>
        </thead>
        <tbody v-if="hasNewsItems">
          <news-item
            v-for="item in newsItemsSorted"
            :key="item.id"
            :newsItem="item"
            :login="login"
            :is-owner="userId === item.author.id"
            @upvote="upvote"
            @downvote="downvote"
            @remove="removeNewsItem"
          />
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="uk-text-center">
              No News in the list!
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <form @submit.prevent="createNewsItem" class="uk-form-large" v-if="login">
      <div class="uk-flex uk-flex-bottom">
        <div class="uk-flex-1  uk-margin">
          <label class="uk-form-label" for="news-title-input">Title</label>

          <div class="uk-form-controls">
            <input
              id="news-title-input"
              class="uk-input"
              v-model="newsTitle"
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
import NewsItem from "../../components/NewsItem/NewsItem.vue";
import LoginForm from "../../components/LoginForm/LoginForm.vue";
import {
  NewsItemModel,
  NewsItemProperties
} from "../../models/news-item.model";
import Vue from "vue";
import { gql } from "apollo-boost";
import jwtDecode, { JwtPayload } from "jwt-decode";

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
`;

const UPVOTE = gql`
  mutation($postId: ID!) {
    upvote(id: $postId)
  }
`;

const DOWNVOTE = gql`
  mutation($postId: ID!) {
    downvote(id: $postId)
  }
`;

const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const WRITE = gql`
  mutation($title: String!) {
    write(title: $title)
  }
`;

const DELETE_POST = gql`
  mutation($postId: ID!) {
    delete(id: $postId)
  }
`;

export default Vue.extend({
  name: "NewsList",
  components: {
    NewsItem,
    LoginForm
  },
  apollo: {
    newsItems: {
      query: GET_POSTS,
      update(data) {
        return data.posts.map(
          (post: NewsItemProperties) => new NewsItemModel(post)
        );
      }
    }
  },
  data() {
    return {
      sortDescending: true,
      currentId: 3,
      newsTitle: "",
      newsItems: [] as NewsItemModel[]
    };
  },
  methods: {
    async signIn(event: { email: string; password: string }) {
      const { email, password } = event;

      try {
        const result = await this.$apollo.mutate({
          mutation: LOGIN,
          variables: {
            email,
            password
          }
        });

        window.localStorage.setItem("token", result.data.login);
        window.location.reload();
      } catch (error) {
        alert(error);
      }
    },
    signOut() {
      window.localStorage.removeItem("token");
      window.location.reload();
    },
    toggleSortOrder() {
      this.sortDescending = !this.sortDescending;
    },
    async upvote(postId: string) {
      try {
        await this.$apollo.mutate({
          mutation: UPVOTE,
          update: async (store, response) => {
            await this.$apolloProvider.defaultClient.reFetchObservableQueries();
          },
          variables: {
            postId
          }
        });
      } catch (e) {
        alert(e);
      }
    },
    async downvote(postId: string) {
      try {
        await this.$apollo.mutate({
          mutation: DOWNVOTE,
          update: async (store, response) => {
            await this.$apolloProvider.defaultClient.reFetchObservableQueries();
          },
          variables: {
            postId
          }
        });
      } catch (e) {
        alert(e);
      }
    },
    async removeNewsItem(postId: string) {
      try {
        await this.$apollo.mutate({
          mutation: DELETE_POST,
          update: async (store, response) => {
            await this.$apolloProvider.defaultClient.reFetchObservableQueries();
          },
          variables: {
            postId
          }
        });
      } catch (e) {
        alert(e);
      }
    },
    async createNewsItem() {
      try {
        const title = this.newsTitle;

        await this.$apollo.mutate({
          mutation: WRITE,
          variables: {
            title
          },
          update: async (store, response) => {
            /*const data = store.readQuery({ query: GET_POSTS }) as any;
            const newPost = {
              id: response.data.write,
              title
            };

            data.posts.push(newPost);

            store.writeQuery({
              query: GET_POSTS,
              data
            });*/

            await this.$apolloProvider.defaultClient.reFetchObservableQueries();
          }
        });
      } catch (error) {
        alert(error);
      }
    }
  },
  computed: {
    jwt(): string | null {
      return window.localStorage.getItem("token");
    },
    userId(): string | null {
      if (this.jwt) {
        const payload = jwtDecode<JwtPayload & { id: string }>(this.jwt);

        if (payload) {
          return payload.id;
        }
      }

      return null;
    },
    login(): boolean {
      return !!this.jwt;
    },
    hasNewsItems(): boolean {
      return this.newsItems.length > 0;
    },
    newsItemsSorted(): NewsItemModel[] {
      if (this.sortDescending) {
        return [...this.newsItems].sort((a, b) => a.compareToDescending(b));
      } else {
        return [...this.newsItems].sort((a, b) => a.compareToAscending(b));
      }
    }
  }
});
</script>

<style scoped>
th {
  color: #000000;
}

.uk-button-primary {
  background-color: #0000ff;
}
</style>
