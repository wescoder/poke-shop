import { GraphQLError } from 'graphql'

export class GQLError extends GraphQLError {
  constructor(message, state) {
    super(message)
    if (state) {
      this.state = state
    }
  }
}

export default GQLError
