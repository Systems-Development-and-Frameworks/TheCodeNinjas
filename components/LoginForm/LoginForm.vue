<template>
  <div>
    <div v-if="!isLoggedIn">
      <v-form @submit.prevent="login">
        <v-text-field
          id="input-email"
          v-model="email"
          type="text"
          placeholder="E-Mail"
        ></v-text-field>

        <v-text-field
          id="input-password"
          v-model="password"
          type="password"
          placeholder="Password"
        ></v-text-field>

        <v-btn
          color="primary"
          type="submit"
          :disabled="loading"
          :loading="loading"
        >
          Sign in
        </v-btn>

        <v-alert v-if="error" color="red lighten-2 mt-4" dark>
          {{ error }}
        </v-alert>
      </v-form>
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
