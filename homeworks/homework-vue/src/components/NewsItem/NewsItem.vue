<template>
  <tr>
    <td class="uk-table-shrink">{{ newsItem.id }}</td>
    <td class="uk-table-expand">{{ newsItem.title }}</td>
    <td class="uk-table-shrink" data-test-votes>{{ newsItem.votes }}</td>
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
import { NewsItemModel } from "@/models/news-item.model";
import Vue from "vue";

export default Vue.extend({
  name: "NewsItem",
  props: {
    newsItem: {
      type: NewsItemModel,
      required: true
    }
  },
  methods: {
    upvote() {
      this.$emit("update", {
        ...this.newsItem,
        votes: this.newsItem.votes + 1
      });
    },
    downvote() {
      this.$emit("update", {
        ...this.newsItem,
        votes: this.newsItem.votes - 1
      });
    },
    remove() {
      this.$emit("remove", this.newsItem.id);
    }
  }
});
</script>

<style scoped lang="scss"></style>
