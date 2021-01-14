<template>
  <div>
    <div v-if="!loggedIn">
      <form @submit.prevent="submit">
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
      <div class="uk-margin">Hallo {{ userId }}</div>

      <div class="uk-margin">
        <textarea v-model="jwt" class="uk-textarea" rows="10" />
      </div>

      <button class="uk-button" @click="signOut">Sign out</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { mapState, mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'LoginForm',
  props: {},

  data() {
    return {
      email: null,
      password: null,
    }
  },
  computed: {
    // jwt(): string | null {
    //   // TODO: get from vuex store
    //   // return window.localStorage.getItem('token')
    //   return ''
    // },
    // userId(): string | null {
    //   if (this.jwt) {
    //     const payload = jwtDecode<JwtPayload & { id: string }>(this.jwt)
    //
    //     if (payload) {
    //       return payload.id
    //     }
    //   }
    //
    //   return null
    // },
    ...mapGetters('auth', ['loggedIn']),
  },
  methods: {
    // signIn() {
    //   const email = this.email
    //   const password = this.password
    //
    //   this.$emit('signIn', { email, password })
    // },
    // signOut() {
    //   this.$emit('signOut')
    // },
    ...mapActions('auth', ['login']),
    submit() {
      try {
        this.login({ email: this.email, password: this.password })
        //  const success: boolean =
      } catch (error) {}
    },
  },
})
</script>

<style scoped lang="scss"></style>
