<template>
  <tr>
    <td class="uk-table-shrink">{{ newsItem.id }}</td>
    <td class="uk-table-expand">{{ newsItem.title }}</td>
    <td class="uk-table-shrink" data-test-votes>{{ newsItem.votes }}</td>
    <td v-if="login" class="uk-table-shrink">
      <button
        v-if="newsItem.id"
        class="uk-icon-button uk-button-default"
        aria-label="Upvote"
        @click="upvote"
      >
        <i class="mdi mdi-18px mdi-thumb-up" aria-hidden="true"></i>
      </button>
    </td>
    <td v-if="login" class="uk-table-shrink">
      <button
        v-if="newsItem.id"
        class="uk-icon-button uk-button-secondary"
        aria-label="Downvote"
        @click="downvote"
      >
        <i class="mdi mdi-18px mdi-thumb-down" aria-hidden="true"></i>
      </button>
    </td>
    <td v-if="login" class="uk-table-shrink">
      <button
        v-if="newsItem.id && isOwner"
        class="uk-icon-button uk-button-default"
        aria-label="Edit"
      >
        <i class="mdi mdi-18px mdi-pencil" aria-hidden="true"></i>
      </button>
    </td>
    <td v-if="login" class="uk-table-shrink">
      <button
        v-if="newsItem.id && isOwner"
        class="uk-icon-button uk-button-danger"
        aria-label="Remove"
        @click="remove"
      >
        <i class="mdi mdi-18px mdi-delete" aria-hidden="true"></i>
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue'
import { NewsItemModel } from '~/models/news-item.model'

export default Vue.extend({
  name: 'NewsItem',
  props: {
    newsItem: {
      type: NewsItemModel,
      required: true,
    },
    isOwner: {
      type: Boolean,
      required: true,
    },
    login: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    remove() {
      this.$emit('remove', this.newsItem)
    },
    upvote() {
      this.$emit('upvote', this.newsItem)
    },
    downvote() {
      this.$emit('downvote', this.newsItem)
    },
  },
})
</script>

<style scoped lang="scss">
.uk-icon-button {
  cursor: pointer;
}
</style>
