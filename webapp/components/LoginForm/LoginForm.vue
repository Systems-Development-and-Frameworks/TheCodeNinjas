<template>
  <v-app>
    <div v-if="!isLoggedIn">
      <v-form @submit.prevent="login">
        <div>
          <div>
            <v-text-field
              id="input-email"
              v-model="email"
              type="text"
              placeholder="E-Mail"
            ></v-text-field>
          </div>
        </div>

        <div>
          <div>
            <v-text-field
              id="input-password"
              v-model="password"
              type="password"
              placeholder="Password"
            ></v-text-field>
          </div>
        </div>

        <div>
          <div>
            <button class="uk-button" type="submit" :disabled="loading">
              Sign in
            </button>

            <div v-if="loading" uk-spinner></div>
          </div>
        </div>

        <div v-if="error" class="uk-alert uk-alert-danger">
          {{ error }}
        </div>
      </v-form>
    </div>
    <div v-else>
      <h1 class="uk-margin">Hallo {{ user.name }}</h1>
    </div>
  </v-app>
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
    isLoggedIn() {
      return this.$accessor.auth.isLoggedIn
    },
    user() {
      return this.$accessor.auth.getUser
    },
    token() {
      return this.$accessor.auth.getToken
    },
    error() {
      return this.$accessor.auth.getError
    },
    loading() {
      return this.$accessor.auth.getLoading
    },
  },
  created() {
    this.$accessor.auth.setLoading(false)
    this.$accessor.auth.setError(null)
  },
  methods: {
    async login() {
      const email = this.email
      const password = this.password

      await this.$accessor.auth.login({ email, password })
    },
    async logout() {
      await this.$accessor.auth.logout()
    },
  },
})
</script>

<style scoped lang="scss"></style>
