<template>
  <div>
    <h2>{{ newsItem.title }} ({{ newsItem.votes }})</h2>

    <button @click="upvote">Upvote</button>
    <button @click="downvote">Downvote</button>
    <button @click="remove">Remove</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NewsItemModel }  from "@/models/news-item.model"

export default defineComponent({
  name: "NewsItem",
  props: {
    newsItem: {
      type: NewsItemModel,
      required: true
    }
  },
  setup(props, context) {
    function upvote() {
      context.emit('upvote', props.newsItem.id);
    }

    function downvote() {
      context.emit('downvote', props.newsItem.id);
    }

    function remove() {
      context.emit('remove', props.newsItem.id);
    }

    return {
      upvote,
      downvote,
      remove
    };
  }
});
</script>

<style scoped lang="scss"></style>
