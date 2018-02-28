import Sequelize from 'sequelize'
import { query, mutation } from './models'
import db from '../db'
import { GraphQLSchema } from 'graphql'

export const schema = new GraphQLSchema({
  query,
  mutation
})

export default schema
