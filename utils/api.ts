import { ApolloHelpers } from '@nuxtjs/apollo'
import { ApolloClient } from 'apollo-client'

// eslint-disable-next-line import/no-mutable-exports
let $apolloHelpers: ApolloHelpers

// eslint-disable-next-line import/no-mutable-exports
let $apolloClient: ApolloClient<any>

export function initializeApolloHelpers(apolloHelpers: ApolloHelpers) {
  $apolloHelpers = apolloHelpers
}

export function initializeApolloClient(apolloClient: ApolloClient<any>) {
  $apolloClient = apolloClient
}

export { $apolloHelpers, $apolloClient }
