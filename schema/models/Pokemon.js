import { post } from 'axios'

import { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLFloat, GraphQLInt } from 'graphql'
import { attributeFields } from 'graphql-sequelize'
import { STRING, INTEGER, DECIMAL } from 'sequelize'

import db from '../../db'
import env from '../../env'
import GQLError from '../GQLError'

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

export const addPokemon = async (_, { pokemon: { name, price, stock } }) => {
  const hasPokemon = await Pokemon.count({ where: { name: name.toLowerCase() } })
  if (hasPokemon) {
    throw new GQLError(`The pokemon with the name "${name}" already exists, try restocking`)
  }
  const pokemon = await Pokemon.create({
    name: name.toLowerCase(),
    price,
    stock
  })
  return pokemon.get()
}

export const restockPokemon = async (_, { pokemonName, quantity }) => {
  const pokemon = await Pokemon.findOne({ where: { name: pokemonName }})
  pokemon.stock += quantity
  await pokemon.save()
  return pokemon.get()
}

export const buyPokemon = async (_, { pokemonName, quantity = 0, creditCard }) => {
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
    .catch((e) => {
      if (e.response) {
        console.log(e)
        const { response } = e
        const { data: { errors }, status } = response
        errors.forEach(({ message }) => {
          throw new GQLError('Payment errror', {
            status,
            errors
          })
        })
        throw new GQLError('There was an error with the payment and it was not completed, please check the payment data and try again')
      } else {
        throw new GQLError('There was an error in our system while making the payment and it was not completed, please try again later')
      }
    })


  const purchase = response.data

  if (purchase.status !== 'paid') {
    throw new GQLError('There was an error with the payment and it was not completed, please check the payment data and try again')
  }

  pokemon.stock -= quantity
  await pokemon.save()
  return pokemon.get()
}

export const pokemonMutations = {
  addPokemon: {
    type: pokemonType,
    description: 'Add pokémon',
    args: {
      pokemon: { type: new GraphQLInputObjectType({
        name: 'addPokemonInput',
        fields: {
          name: { type: GraphQLString },
          price: { type: GraphQLFloat },
          stock: { type: GraphQLInt }
        }
      }) }
    },
    resolve: addPokemon
  },
  restockPokemon: {
    type: pokemonType,
    description: 'Restock pokémon',
    args: {
      pokemonName: { type: GraphQLString },
      quantity: { type: GraphQLInt }
    },
    resolve: restockPokemon
  },
  buyPokemon: {
    type: pokemonType,
    description: 'Buy a pokémon',
    args: {
      pokemonName: { type: GraphQLString },
      quantity: { type: GraphQLInt },
      creditCard: {
        type: new GraphQLInputObjectType({
          name: 'creditCardInput',
          fields: {
            card_number: { type: GraphQLString },
            card_expiration_date: { type: GraphQLString },
            card_holder_name: { type: GraphQLString },
            card_cvv: { type: GraphQLString }
          }
        })
      }
    },
    resolve: buyPokemon
  }
}

export default Pokemon
