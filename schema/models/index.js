import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLOutputType } from 'graphql'
import { attributeFields, defaultListArgs, resolver } from 'graphql-sequelize'
import { post } from 'axios'

import env from '../../env'
import GQLError from '../GQLError'
import Pokemon, { pokemonType, pokemonInput } from './Pokemon'

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
      description: 'Add pokémon',
      args: {
        pokemon: { type: pokemonInput.add }
      },
      resolve: async (_, { pokemon: pokemonData }) => {
        const pokemon = await Pokemon.create(pokemonData)
        return pokemon.get()
      }
    },
    restockPokemon: {
      type: pokemonType,
      description: 'Restock pokémon',
      args: {
        pokemonName: { type: GraphQLString },
        quantity: { type: GraphQLInt }
      },
      resolve: async (_, { pokemonName, quantity }) => {
        const pokemon = await Pokemon.findOne({ where: { name: pokemonName }})
        pokemon.stock += quantity
        await pokemon.save()
        return pokemon.get()
      }
    },
    buyPokemon: {
      type: pokemonType,
      description: 'Buy a pokémon',
      args: {
        pokemonName: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        creditCard: { type: pokemonInput.creditCard }
      },
      resolve: async (_, { pokemonName, quantity = 0, creditCard }) => {
        if (!pokemonName) {
          throw new GQLError(`Pokémon name must be supplied`)
        }
        if (!creditCard) {
          throw new GQLError(`Payment info must be supplied`)
        }

        const pokemon = await Pokemon.findOne({ where: { name: pokemonName } })

        if (!pokemon) {
          throw new GQLError(`Pokémon "${pokemonName}" not found in stock, try another pokémon`)
        }
        if (pokemon.stock < quantity) {
          throw new GQLError(`Not enought ${pokemon.name} in stock: ${pokemon.stock}`)
        }

        const response = await post(env.paymentEndpoint, Object.assign({
          api_key: env.paymentAPIKey,
          amount: pokemon.price * quantity * 100
        }, creditCard))
          .catch(({ response: { data: { errors }, status } }) => {
            errors.forEach(({ message }) => {
              throw new GQLError('Payment errror', {
                status,
                errors
              })
            })
            throw new GQLError('There was an error with the payment and it was not completed, please check the payment data and try again')
          })

        const purchase = response.data

        if (purchase.status !== 'paid') {
          throw new GQLError('There was an error with the payment and it was not completed, please check the payment data and try again')
        }

        pokemon.stock -= quantity
        await pokemon.save()
        return pokemon.get()
      }
    }
  })
})
