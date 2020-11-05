<template>
  <div>
    <news-list />
  </div>
</template>

<script lang="ts">
import NewsList from "@/components/NewsList.vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
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
