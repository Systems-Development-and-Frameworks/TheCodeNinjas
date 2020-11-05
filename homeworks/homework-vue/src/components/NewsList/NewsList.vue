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
      <div class="uk-flex">
        <div class="uk-flex-1">
          <input
            class="uk-input"
            v-model="newsTitle"
            placeholder="Please enter title"
          />
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
import NewsItem from "@/components/NewsItem/NewsItem.vue";
import { NewsItemModel } from "@/models/news-item.model";
import Vue from "vue";

export default Vue.extend({
  name: "NewsList",
  components: {
    NewsItem
  },
  data() {
    return {
      sortDescending: true,
      currentId: 3,
      newsTitle: "",
      newsItems: [
        new NewsItemModel({
          id: 1,
          title: "Hackernews Nr 1",
          votes: 0
        }),
        new NewsItemModel({
          id: 2,
          title: "Hackernews Nr 2",
          votes: 0
        }),
        new NewsItemModel({
          id: 3,
          title: "Hackernews Nr 3",
          votes: 0
        })
      ]
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
    removeNewsItem(id: number) {
      this.newsItems = this.newsItems.filter(item => item.id !== id);
    },

    createNewsItem() {
      this.currentId++;
      const newItem = new NewsItemModel({
        id: this.currentId,
        title: this.newsTitle,
        votes: 0
      });

      this.newsItems = [...this.newsItems, newItem];
      this.newsTitle = "";
    }
  },
  computed: {
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
