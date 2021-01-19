import { Plugin } from '@nuxt/types'
import { initializeApolloHelpers } from '~/utils/api'

const accessor: Plugin = (context) => {
  initializeApolloHelpers(context.$apolloHelpers)
}

export default accessor
