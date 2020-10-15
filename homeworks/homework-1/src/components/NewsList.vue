<template>
  <div class="uk-container uk-margin-top">
    <h1 class="uk-heading-xlarge uk-text-center">News List</h1>

    <div class="news-items-wrapper">
      <table class="uk-table uk-table-striped uk-table-medium uk-table-middle">
        <thead>
          <tr>
            <th class="uk-table-shrink">Id</th>
            <th class="uk-table-expand">Title</th>
            <th class="uk-table-shrink">Votes</th>
            <th colspan="3" class="uk-table-shrink"></th>
          </tr>
        </thead>
        <tbody v-if="newsItems.length > 0">
          <news-item
            v-for="item in newsItems"
            :key="item.id"
            :newsItem="item"
            @upvote="upvoteNewsItem"
            @downvote="downvoteNewsItem"
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
            type="text"
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
import { defineComponent, ref } from "vue";
import NewsItem from "@/components/NewsItem.vue";
import { NewsItemModel } from "@/models/news-item.model";

export default defineComponent({
  name: "NewsList",
  components: {
    NewsItem
  },
  setup() {
    const newsTitle = ref("");
    const newsItems = ref<NewsItemModel[]>([
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
    ]);

    function upvoteNewsItem(id: number) {
      newsItems.value = newsItems.value
        .map(item => {
          if (item.id === id) {
            return new NewsItemModel({
              ...item,
              votes: item.votes + 1
            });
          } else {
            return item;
          }
        })
        .sort((a, b) => b.votes - a.votes);
    }

    function downvoteNewsItem(id: number) {
      newsItems.value = newsItems.value
        .map(item => {
          if (item.id === id) {
            return new NewsItemModel({
              ...item,
              votes: item.votes - 1
            });
          } else {
            return item;
          }
        })
        .sort((a, b) => b.votes - a.votes);
    }

    function removeNewsItem(id: number) {
      newsItems.value = newsItems.value.filter(item => item.id != id);
    }

    function createNewsItem() {
      const id =
        newsItems.value
          .map(item => item.id)
          .reduce((acc, cur) => Math.max(acc, cur), 0) + 1;

      const newItem = new NewsItemModel({
        id: id,
        title: newsTitle.value,
        votes: 0
      });

      newsItems.value = [...newsItems.value, newItem];
      newsTitle.value = "";
    }

    return {
      newsItems,
      upvoteNewsItem,
      downvoteNewsItem,
      removeNewsItem,
      createNewsItem,
      newsTitle
    };
  }
});
</script>

<style scoped lang="scss"></style>
