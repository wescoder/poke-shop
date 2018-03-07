import { post } from 'axios'

import { PAYMENT_API, PAYMENT_API_KEY } from '../../env'
import GQLError from '../GQLError'
import { Pokemon } from '../../db/models'

export const pokemons = async () => {
  return (await Pokemon.find()).map(p => p.get())
}

export const addPokemon = async (_, { pokemonData: { name, price, stock } }) => {
  const hasPokemon = await Pokemon.count({ 'name': name.toLowerCase() })
  if (hasPokemon) {
    throw new GQLError(`The pokemon with the name "${name}" already exists, try restocking`)
  }
  const pokemon = new Pokemon({
    name: name.toLowerCase(),
    price,
    stock
  })
  await pokemon.save()
  return pokemon.get()
}

export const restockPokemon = async (_, { pokemonName, quantity }) => {
  const pokemon = await Pokemon.findOne({ name: pokemonName })
  pokemon.restock(quantity)
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

  const pokemon = await Pokemon.findOne({ name: pokemonName })

  if (!pokemon) {
    throw new GQLError(`Pokémon "${pokemonName}" not found in stock, try another pokémon`)
  }
  if (pokemon.get('stock') < quantity) {
    throw new GQLError(`Not enought ${pokemon.get('name')} in stock: ${pokemon.get('stock')}`)
  }

  const response = await post(PAYMENT_API, Object.assign({
    api_key: PAYMENT_API_KEY,
    amount: pokemon.get('price') * quantity * 100
  }, creditCard))
    .catch((e) => {
      if (e.response) {
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

  pokemon.buy(quantity)
  await pokemon.save()
  return pokemon.get()
}
