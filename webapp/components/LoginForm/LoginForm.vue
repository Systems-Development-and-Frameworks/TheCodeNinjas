<template>
  <div>
    <div v-if="!loggedIn">
      <form @submit.prevent="login">
        <div class="uk-margin">
          <div class="uk-inline">
            <input
              v-model="email"
              class="uk-input"
              type="text"
              placeholder="E-Mail"
            />
          </div>
        </div>

        <div class="uk-margin">
          <div class="uk-inline">
            <input
              v-model="password"
              class="uk-input"
              type="password"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <div class="uk-inline">
            <button class="uk-button" type="submit">Sign in</button>
          </div>
        </div>
      </form>
    </div>
    <div v-else>
      <h1 class="uk-margin">Hallo {{ user.name }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LoginForm',
  data() {
    return {
      email: null,
      password: null,
    }
  },
  computed: {
    loggedIn() {
      return this.$accessor.auth.loggedIn
    },
    user() {
      return this.$accessor.auth.user
    },
    token() {
      return this.$accessor.auth.token
    },
  },
  methods: {
    login() {
      const email = this.email
      const password = this.password

      this.$accessor.auth.login({ email, password })
    },
    logout() {
      this.$accessor.auth.logout()
    },
  },
})
</script>

<style scoped lang="scss"></style>
