<template>
  <tr>
    <td class="uk-table-shrink">{{ newsItem.id }}</td>
    <td class="uk-table-expand">{{ newsItem.title }}</td>
    <td class="uk-table-shrink">{{ newsItem.votes }}</td>
    <td class="uk-table-shrink">
      <button @click="upvote" class="uk-icon-button uk-button-default">
        <i class="mdi mdi-18px mdi-thumb-up" aria-hidden="true"></i>
      </button>
    </td>
    <td class="uk-table-shrink">
      <button @click="downvote" class="uk-icon-button uk-button-secondary">
        <i class="mdi mdi-18px mdi-thumb-down" aria-hidden="true"></i>
      </button>
    </td>
    <td class="uk-table-shrink">
      <button @click="remove" class="uk-icon-button uk-button-danger">
        <i class="mdi mdi-18px mdi-delete" aria-hidden="true"></i>
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NewsItemModel } from "@/models/news-item.model";

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
      context.emit("update", {...props.newsItem, votes: (props.newsItem.votes + 1)});
    }

    function downvote() {
      context.emit("update", {...props.newsItem, votes: (props.newsItem.votes - 1)});
    }

    function remove() {
      context.emit("remove", props.newsItem.id);
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
