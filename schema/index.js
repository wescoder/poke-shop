import { makeExecutableSchema } from 'graphql-tools'

import typeDefs from './root.gql'
import resolvers from './resolvers'

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
