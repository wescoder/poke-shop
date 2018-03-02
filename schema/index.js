import db from '../db'
import { query, mutation } from './models'
import { GraphQLSchema } from 'graphql'

export const schema = new GraphQLSchema({
  query,
  mutation
})

export default schema
