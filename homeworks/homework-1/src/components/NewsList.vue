<template>
  <div class="center">
    <h1>News List</h1>

    <div class="news-items-wrapper">
      <news-item
        v-for="item in newsItems"
        :key="item.id"
        :newsItem="item"
        @upvote="upvoteNewsItem"
        @downvote="downvoteNewsItem"
        @remove="removeNewsItem"
      />
    </div>

    <form @submit.prevent="createNewsItem">
      <input v-model="newsTitle" type="text" />
      <button type="submit">Create</button>
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
      const newItem = new NewsItemModel({
        id: newsItems.value.map(item => item.id).reduce((acc, cur) => Math.max(acc, cur)) + 1,
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

<style scoped lang="scss">
.center {
  text-align: center;
}

.news-items-wrapper {
  margin-bottom: 5rem;
}
</style>
