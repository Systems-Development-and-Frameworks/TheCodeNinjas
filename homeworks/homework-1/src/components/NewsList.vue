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

    <form>
      <input type="text" />
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
    const newsItems = ref<NewsItemModel[]>([
      {
        id: 1,
        title: "Hackernews Nr 1",
        votes: 0
      },
      {
        id: 2,
        title: "Hackernews Nr 2",
        votes: 0
      },
      {
        id: 3,
        title: "Hackernews Nr 3",
        votes: 0
      }
    ]);

    function upvoteNewsItem(id: number) {
      newsItems.value = newsItems.value
        .map(item => {
          if (item.id === id) {
            return {
              ...item,
              votes: item.votes + 1
            };
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
            return {
              ...item,
              votes: item.votes - 1
            };
          } else {
            return item;
          }
        })
        .sort((a, b) => b.votes - a.votes);
    }

    function removeNewsItem(id: number) {
      console.log("remove", id);
      newsItems.value = newsItems.value.filter(item => item.id != id );
    }

    function createNewsItem() {
      const newItem: NewsItemModel = {
        id: 5555,
        title: "",
        votes: 0
      };

      newsItems.value.push();

      newsItems.value = [...newsItems.value, newItem];
    }

    return {
      newsItems,
      upvoteNewsItem,
      downvoteNewsItem,
      removeNewsItem
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
