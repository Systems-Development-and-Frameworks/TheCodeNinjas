import { ApolloHelpers } from '@nuxtjs/apollo'

export const $apolloHelpers: Partial<ApolloHelpers> = {
  getToken(tokenName?) {
    return "fakeToken"
  },
  onLogin(token, apolloClient?, cookieAttributes?, skipResetStore?) {
    return Promise.resolve()
  },
  onLogout(apolloClient?){
    return Promise.resolve()
  }
}
export const $apolloClient = {
  mutate(options) {
    return Promise.resolve({
      data: {
        login: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNraWhvdHhjdzA5OGYwYTA4NXVzdGZwZGwiLCJuYW1lIjoiUGhpbGxpcCBGcmllZGVsIiwiZW1haWwiOiJzMDU1NzkxN0BodHctYmVybGluLmRlIiwiaWF0IjoxNjExNjU4ODg1LCJleHAiOjE2MTE3NDUyODV9.hUCvx-Hr4eF9snbriGcu_hNZ9OylWljP9sXv-XHv-Qc',
      }
    })
  }
}
