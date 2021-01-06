<template>
  <tr>
    <td class="uk-table-shrink">{{ newsItem.id }}</td>
    <td class="uk-table-expand">{{ newsItem.title }}</td>
    <td class="uk-table-shrink" data-test-votes>{{ newsItem.votes }}</td>
    <td class="uk-table-shrink" v-if="login">
      <button
        v-if="newsItem.id"
        @click="upvote"
        class="uk-icon-button uk-button-default"
        aria-label="Upvote"
      >
        <i class="mdi mdi-18px mdi-thumb-up" aria-hidden="true"></i>
      </button>
    </td>
    <td class="uk-table-shrink" v-if="login">
      <button
        v-if="newsItem.id"
        @click="downvote"
        class="uk-icon-button uk-button-secondary"
        aria-label="Downvote"
      >
        <i class="mdi mdi-18px mdi-thumb-down" aria-hidden="true"></i>
      </button>
    </td>
    <td class="uk-table-shrink" v-if="login">
      <button
        v-if="newsItem.id && isOwner"
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
      this.$emit("remove", this.newsItem);
    },
    upvote() {
      this.$emit("upvote", this.newsItem);
    },
    downvote() {
      this.$emit("downvote", this.newsItem);
    }
  }
});
</script>

<style scoped lang="scss">
.uk-icon-button {
  cursor: pointer;
}
</style>
