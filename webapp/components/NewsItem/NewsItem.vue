<template>
  <v-col cols="12" md="4">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="4" md="12" class="text-center">
            <v-avatar color="primary" size="100">
              <v-img
                :src="`https://robohash.org/${newsItem.id}.png`"
                :alt="newsItem.author.name"
              ></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="8" md="12" class="text-center">
            {{ newsItem.title }}
            ( <span data-test-votes>{{ newsItem.votes }}</span> )
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-actions v-if="login">
        <v-btn v-if="newsItem.id" elevation="2" color="" icon @click="upvote">
          <v-icon>mdi-thumb-up</v-icon>
        </v-btn>
        <v-btn v-if="newsItem.id" elevation="2" color="" icon @click="downvote">
          <v-icon>mdi-thumb-down</v-icon>
        </v-btn>

        <v-btn v-if="newsItem.id && isOwner" elevation="2" icon>
          <v-icon color="orange">mdi-pencil</v-icon>
        </v-btn>

        <v-btn v-if="newsItem.id && isOwner" elevation="2" icon @click="remove">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
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
