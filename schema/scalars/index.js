import {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime,
  GraphQLUUID
} from 'graphql-custom-types'

export const scalars = {
  DateTime: GraphQLDateTime,
  Email: GraphQLEmail,
  UUID: GraphQLUUID,
  Url: GraphQLURL
}

export default scalars
