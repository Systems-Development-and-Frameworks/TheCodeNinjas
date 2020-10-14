<template>
  <news-list />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NewsList from "@/components/NewsList.vue";

export default defineComponent({
  name: "App",
  components: {
    NewsList
  }
});
</script>

<style lang="scss"></style>
