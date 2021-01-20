<template>
  <div>
    <nav class="uk-navbar-container">
      <div class="uk-container uk-flex uk-flex-row">
        <div class="uk-navbar-left">
          <ul class="uk-navbar-nav">
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/news">News</NuxtLink></li>
          </ul>
        </div>

        <div class="uk-navbar-right">
          <ul class="uk-navbar-nav">
            <li v-if="!isLoggedIn"><NuxtLink to="/login">Login</NuxtLink></li>
            <li v-else><NuxtLink to="/logout">Logout</NuxtLink></li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="uk-container uk-margin-top">
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    isLoggedIn() {
      return this.$accessor.auth.isLoggedIn
    },
  },
})
</script>

<style lang="scss">
@import '~uikit/src/scss/variables-theme.scss';
@import '~uikit/src/scss/mixins-theme.scss';
@import '~uikit/src/scss/uikit-theme.scss';
</style>
