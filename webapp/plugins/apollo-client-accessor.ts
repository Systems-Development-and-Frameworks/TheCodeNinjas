import { Plugin } from '@nuxt/types'
import { initializeApolloClient } from '~/utils/api'

const accessor: Plugin = (context) => {
  initializeApolloClient(context.app.apolloProvider.defaultClient)
}

export default accessor
