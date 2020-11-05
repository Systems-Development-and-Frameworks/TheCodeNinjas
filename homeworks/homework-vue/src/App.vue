<template>
  <news-list :props="{newsItems: data}" />
</template>

<script lang="ts">
import NewsList from "@/components/NewsList.vue";
import { defineComponent, ref} from "@vue/composition-api";
import { NewsItemModel } from './models/news-item.model';

export default defineComponent({
  name: "App",
  components: {
    NewsList
  },
  setup(){
    const data = ref([
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
  }
});
</script>

<style lang="scss">
@import "~uikit/src/scss/variables-theme.scss";
@import "~uikit/src/scss/mixins-theme.scss";
@import "~uikit/src/scss/uikit-theme.scss";
</style>
