import db from '../../db'

import { GraphQLObjectType, GraphQLInputObjectType, GraphQLInputType, GraphQLString, GraphQLFloat, GraphQLInt } from 'graphql'
import { attributeFields } from 'graphql-sequelize'
import { STRING, INTEGER, DECIMAL } from 'sequelize'

export const Pokemon = db.define('pokemon', {
  name: {
    type: STRING,
    allowNull: false
  },
  price: {
    type: DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0
  }
})

export const pokemonType = new GraphQLObjectType({
  name: 'Pokemon',
  description: 'A Pokémon',
  fields: Object.assign(attributeFields(Pokemon), {})
})

export const addPokemonInput = new GraphQLInputObjectType({
  name: 'addPokemonInput',
  fields: {
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
    stock: { type: GraphQLInt }
  }
})

export default Pokemon
