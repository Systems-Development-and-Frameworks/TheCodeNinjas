<template>
  <div>
    <div v-if="!login">
      <form @submit.prevent="signIn">
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
        <textarea class="uk-textarea" rows="10" v-model="jwt" />
      </div>

      <button class="uk-button" @click="signOut">Sign out</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import jwtDecode, { JwtPayload } from "jwt-decode";

export default Vue.extend({
  name: "LoginForm",
  props: {
    login: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    signIn() {
      const email = this.email;
      const password = this.password;

      this.$emit("signIn", { email, password });
    },
    signOut() {
      this.$emit("signOut");
    }
  },
  computed: {
    jwt(): string | null {
      return window.localStorage.getItem("token");
    },
    userId(): string | null {
      if (this.jwt) {
        const payload = jwtDecode<JwtPayload & { id: string }>(this.jwt);

        if (payload) {
          return payload.id;
        }
      }

      return null;
    }
  }
});
</script>

<style scoped lang="scss"></style>
