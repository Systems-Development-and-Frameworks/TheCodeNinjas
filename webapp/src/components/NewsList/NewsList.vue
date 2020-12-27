<template>
  <div class="uk-container uk-margin-top">
    <h1 class="uk-heading-xlarge uk-text-center">News List</h1>

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
            <th colspan="3" class="uk-table-shrink"></th>
          </tr>
        </thead>
        <tbody v-if="hasNewsItems">
          <news-item
            v-for="item in newsItemsSorted"
            :key="item.id"
            :newsItem="item"
            @update="updateNewsItem"
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

    <form @submit.prevent="createNewsItem" class="uk-form-large">
      <div class="uk-flex uk-flex-bottom">
        <div class="uk-flex-1">
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
        <div>
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
import {
  NewsItemModel,
  NewsItemProperties
} from "../../models/news-item.model";
import Vue from "vue";
import { gql } from "apollo-boost";

export default Vue.extend({
  name: "NewsList",
  components: {
    NewsItem
  },
  apollo: {
    newsItems: {
      query: gql`
        query {
          posts {
            id
            title
            votes
          }
        }
      `,
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
    toggleSortOrder() {
      this.sortDescending = !this.sortDescending;
    },
    updateNewsItem(newsItem: NewsItemModel) {
      this.newsItems = this.newsItems.map(item => {
        if (item.id !== newsItem.id) {
          return item;
        }

        return new NewsItemModel({
          ...item,
          votes: newsItem.votes
        });
      });
    },
    removeNewsItem(id: string) {
      this.$apollo.mutate({
        mutation: gql`
          mutation($postId: ID!) {
            delete(id: $postId)
          }
        `,
        update(store, response) {
          console.log(store);
          console.log(response);
        },
        variables: {
          postId: id
        }
      });
    },

    createNewsItem() {
      this.$apollo.mutate({
        mutation: gql`
          mutation($postId: ID!) {
            delete(id: $postId)
          }
        `,
        update(store, response) {
          console.log(store);
          console.log(response);
        }
      });
      /*this.currentId++;
      const newItem = new NewsItemModel({
        id: this.currentId,
        title: this.newsTitle,
        votes: 0
      });

      this.newsItems = [...this.newsItems, newItem];
      this.newsTitle = "";*/
    }
  },
  computed: {
    hasNewsItems(): boolean {
      console.log(this.newsItems);
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
