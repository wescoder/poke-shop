import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLOutputType } from 'graphql'
import { defaultListArgs, resolver } from 'graphql-sequelize'

import Pokemon, { pokemonType, pokemonMutations } from './Pokemon'

export const models = [
  Pokemon
]

export const schemas = [
  pokemonType
]

// Sync all models and model relations
models.forEach(async model => model.sync())

export const query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    pokemons: {
      type: new GraphQLList(pokemonType),
      args: defaultListArgs(),
      resolve: resolver(Pokemon)
    }
  }
})

schemas.push(query)

export const mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => Object.assign({}, pokemonMutations)
})
