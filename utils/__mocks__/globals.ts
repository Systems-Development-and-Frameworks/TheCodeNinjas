import { ApolloHelpers } from '@nuxtjs/apollo'

export const $apolloHelpers: Partial<ApolloHelpers> = {
  getToken(tokenName?) {
    return 'fakeToken'
  },
  onLogin(token, apolloClient?, cookieAttributes?, skipResetStore?) {
    return Promise.resolve()
  },
  onLogout(apolloClient?) {
    return Promise.resolve()
  },
}
export const $apolloClient = {
  mutate(options) {
    if (isWrongCredentialsLogin(options)) {
      const errorMessage = { message: 'Testing wrongCredentials' }
      throw errorMessage
    }

    if (isInvalidTokenLogin(options)) {
      return Promise.resolve({
        data: {
          login: 'invalidToken',
        },
      })
    }

    return Promise.resolve({
      data: {
        login:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNraWhvdHhjdzA5OGYwYTA4NXVzdGZwZGwiLCJuYW1lIjoiUGhpbGxpcCBGcmllZGVsIiwiZW1haWwiOiJzMDU1NzkxN0BodHctYmVybGluLmRlIiwiaWF0IjoxNjExNjU4ODg1LCJleHAiOjE2MTE3NDUyODV9.hUCvx-Hr4eF9snbriGcu_hNZ9OylWljP9sXv-XHv-Qc',
      },
    })
  },
}

function isWrongCredentialsLogin(options) {
  if (
    options.variables.email === 'wrongCredentials@test.com' &&
    options.variables.password === 'wrongPassword'
  ) {
    return true
  }

  return false
}

function isInvalidTokenLogin(options) {
  if (
    options.variables.email === 'invalidToken@test.com' &&
    options.variables.password === 'somePassword'
  ) {
    return true
  }

  return false
}
