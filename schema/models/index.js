import { GraphQLObjectType, GraphQLList, GraphQLOutputType} from 'graphql'
import { attributeFields, defaultListArgs, resolver } from 'graphql-sequelize'

import Pokemon, { pokemonType, addPokemonInput } from './Pokemon'

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
  fields: () => ({
    addPokemon: {
      type: pokemonType,
      description: 'Add Pokémon',
      args: {
        pokemon: {
          type: addPokemonInput
        }
      },
      resolve: async (_, { pokemon: pokemonData }) => {
        const pokemon = await Pokemon.create(pokemonData)
        return pokemon.get()
      }
    }
  })
})
