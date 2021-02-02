<template>
  <v-container class="py-16"> You have been logged out </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    isLoggedIn() {
      return this.$accessor.auth.isLoggedIn
    },
  },
  created() {
    this.logout()
  },
  methods: {
    logout() {
      this.$accessor.auth.logout()
    },
  },
})
</script>
