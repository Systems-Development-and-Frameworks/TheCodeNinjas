declare module '*.gql' {
  // eslint-disable-next-line import/no-duplicates
  import { DocumentNode } from 'graphql'

  const content: DocumentNode
  export default content
}

declare module '*.graphql' {
  // eslint-disable-next-line import/no-duplicates
  import { DocumentNode } from 'graphql'

  const content: DocumentNode
  export default content
}
