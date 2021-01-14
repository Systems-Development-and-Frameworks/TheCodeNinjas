import cookie from 'cookie'

import { SET_USER, SET_TOKEN, SET_LOADING } from './'
import authenticateUserGql from '~/gql/authenticateUserGql.gql'

export const WRONG_CREDENTIALS = 'Wrong email/password combination'

export const state = () => ({
  loading: false,
  token: null,
  currentUser: null,
})

export const getters = {
  loggedIn(state) {
    return !!state.token
  },
}

export const mutations = {
  [SET_TOKEN](state, token) {
    state.token = token
  },
  [SET_USER](state, user) {
    state.currentUser = user
  },
  [SET_LOADING](state, loading) {
    state.loading = loading
  },
}

export const actions = {
  nuxtServerInit(store, context) {
    const { req } = context.ssrContext
    if (!req) return // static site generation
    const parsedCookies = cookie.parse(req.headers.cookie)
    const token = parsedCookies['apollo-token']
    if (!token) return
    store.commit('auth/setToken', token)
  },

  // TODO: cant access this.$apollo and because of that cant get token and cant call this.$apolloHelpers.onLogin(token)
  login(store, payload) {
    store.commit(SET_LOADING, true)
    console.log('test1')
    // const { token, user } = this

    // console.log(this)
    // const res = await this.$apollo
    //   .mutate({
    //     mutation: authenticateUserGql,
    //     variables: {
    //       email,
    //       password,
    //     },
    //   })
    //   .then((res) => res)
    //
    // console.log(res)
    //
    // if (!res.token) {
    //   store.commit(SET_LOADING, false)
    //   return false
    // }
    //
    // const token:string = await this.$apolloHelpers.onLogin(res.login)
    //
    // store.commit(SET_TOKEN, token)
    // store.commit(SET_USER, user)
  },
  logout({ commit }) {
    commit(SET_TOKEN, null)
    commit(SET_USER, null)
  },
}
