import gql from 'graphql-tag'
import jwtDecode from 'jwt-decode'

import { actionTree, getterTree, mutationTree } from 'typed-vuex'

import { $apolloClient, $apolloHelpers } from '~/utils/globals'
import { PersonProperties } from '~/models/person.model'

const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

export const state = () => ({
  loading: false,
  token: null as string | null,
  user: null as PersonProperties | null,
})

export const getters = getterTree(state, {
  isLoggedIn(s): boolean {
    return !!s.token
  },
  getToken(s): string | null {
    return s.token
  },
  getUser(s): PersonProperties | null {
    return s.user as PersonProperties | null
  },
})
export const mutations = mutationTree(state, {
  setLoading(s, loading) {
    s.loading = loading
  },
  setUser(s, user) {
    s.user = user
  },
  setToken(s, token) {
    s.token = token
  },
  initialiseStore() {},
})
export const actions = actionTree(
  { state, getters, mutations },
  {
    async login(context, { email, password }) {
      context.commit('setLoading', true)

      try {
        const result = await $apolloClient.mutate({
          mutation: LOGIN,
          variables: {
            email,
            password,
          },
        })

        const token = result.data.login
        const user = jwtDecode<any>(token)
        await $apolloHelpers.onLogin(token)

        context.commit('setUser', user)
        context.commit('setToken', token)
      } catch (e) {
        alert(e)
      }

      context.commit('setLoading', false)
    },
    async logout(context) {
      context.commit('setLoading', true)

      await $apolloHelpers.onLogout()

      context.commit('setUser', null)
      context.commit('setToken', null)
      context.commit('setLoading', false)
    },
  }
)
