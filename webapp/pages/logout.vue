<template>
  <div>You have been logged out</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    loggedIn() {
      return this.$accessor.auth.loggedIn
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
