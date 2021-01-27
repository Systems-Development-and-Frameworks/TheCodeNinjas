import { Plugin } from '@nuxt/types'
import { initializeApolloClient } from '~/utils/globals'

const accessor: Plugin = (context) => {
  initializeApolloClient(context.app.apolloProvider.defaultClient)
}

export default accessor
