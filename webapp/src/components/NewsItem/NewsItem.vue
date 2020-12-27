<template>
  <tr>
    <td class="uk-table-shrink">{{ newsItem.id }}</td>
    <td class="uk-table-expand">{{ newsItem.title }}</td>
    <td class="uk-table-shrink" data-test-votes>{{ newsItem.votes }}</td>
    <td class="uk-table-shrink" v-if="login">
      <button
        @click="upvote"
        class="uk-icon-button uk-button-default"
        aria-label="Upvote"
      >
        <i class="mdi mdi-18px mdi-thumb-up" aria-hidden="true"></i>
      </button>
    </td>
    <td class="uk-table-shrink" v-if="login">
      <button
        @click="downvote"
        class="uk-icon-button uk-button-secondary"
        aria-label="Downvote"
      >
        <i class="mdi mdi-18px mdi-thumb-down" aria-hidden="true"></i>
      </button>
    </td>
    <td class="uk-table-shrink" v-if="login">
      <button
        v-if="isOwner"
        @click="remove"
        class="uk-icon-button uk-button-danger"
        aria-label="Remove"
      >
        <i class="mdi mdi-18px mdi-delete" aria-hidden="true"></i>
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import { NewsItemModel } from "../..//models/news-item.model";
import Vue from "vue";

export default Vue.extend({
  name: "NewsItem",
  props: {
    newsItem: {
      type: NewsItemModel,
      required: true
    },
    isOwner: {
      type: Boolean,
      required: true
    },
    login: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    remove() {
      this.$emit("remove", this.newsItem.id);
    },
    upvote() {
      this.$emit("upvote", this.newsItem.id);
    },
    downvote() {
      this.$emit("downvote", this.newsItem.id);
    }
  }
});
</script>

<style scoped lang="scss">
.uk-icon-button {
  cursor: pointer;
}
</style>
