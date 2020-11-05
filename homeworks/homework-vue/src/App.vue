<template>
  <div>
    <news-list />
  </div>
</template>

<script lang="ts">
import NewsList from "@/components/NewsList/NewsList.vue";
import Vue from "vue";

export default Vue.extend({
  name: "App",
  components: {
    NewsList
  }
});
</script>

<style lang="scss">
@import "~uikit/src/scss/variables-theme.scss";
@import "~uikit/src/scss/mixins-theme.scss";
@import "~uikit/src/scss/uikit-theme.scss";
</style>
