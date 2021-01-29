<template>
  <v-app>
    <v-app-bar color="deep-purple accent-4" dense dark>
      <v-app-bar-nav-icon
        class='hidden-sm-and-up'
        @click.stop="drawer = !drawer"
      >
      </v-app-bar-nav-icon>

      <v-btn router to="/" class='mx-1 hidden-md-and-down'> Home </v-btn>

      <v-btn router to="/news" class='hidden-md-and-down' >
        News
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        v-if="!isLoggedIn"
        class='hidden-md-and-down'
        router
        to="/login"
      >
        Login
      </v-btn>

      <v-btn v-else router to="/logout" class='hidden-md-and-down'>
        Logout
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute left temporary>
      <v-list nav dense>
        <v-list-item router to="/">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item router to="/news">
          <v-list-item-title>News</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="!isLoggedIn" router to="/login">
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>

        <v-list-item v-else router to="/logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <Nuxt />

    <v-footer
      color="primary lighten-1"
      padless
    >
      <v-row
        justify="center"
        no-gutters
      >
        <v-btn
          v-for="link in links"
          :key="link"
          color="white"
          text
          rounded
          class="my-2"
        >
          {{ link }}
        </v-btn>
        <v-col
          class="primary lighten-2 py-4 text-center white--text"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Vuetify from 'vuetify'
import { NewsItemModel } from '~/models/news-item.model'

Vue.use(Vuetify)

export default Vue.extend({
  data() {
    return {
      drawer: false,
    }
  },
  computed: {
    isLoggedIn() {
      return this.$accessor.auth.isLoggedIn
    },
  },
})
</script>

<style lang="scss"></style>
