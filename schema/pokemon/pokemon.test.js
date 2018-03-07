import test from 'ava'

import { addPokemon, restockPokemon, buyPokemon } from './index'
import db from '../../db'
import models, { Pokemon } from '../../db/models'

test.before('Connect DB', async t => {
  t.context.db = db
  await db.connect()
})

test.after('Empty DB', t => {
  Object.keys(models)
    .forEach(async k => {
      const model = models[k]
      await model.remove()
    })
})

test.serial('addPokemon', async t => {
  const pokemon = await addPokemon(
    null,
    { pokemonData: { name: 'muk', price: 300, stock: 10 } }
  )

  t.truthy(pokemon._id)
  t.is(pokemon.name, 'muk')
  t.is(pokemon.price, 300)
  t.is(pokemon.stock, 10)
  t.truthy(pokemon.created_at)
  t.truthy(pokemon.updated_at)
  t.pass()
})

test.serial('restockPokemon', async t => {
  const muk = await Pokemon.find()
  const pokemon = await restockPokemon(
    null,
    { pokemonName: 'muk', quantity: 10 }
  )

  t.is(pokemon.stock, 20)
  t.pass()
})

test.serial('buyPokemon', async t => {
  const pokemon = await buyPokemon(
    null,
    {
      pokemonName: 'muk',
      quantity: 1,
      creditCard: {
        card_number: '4024007187545495',
        card_expiration_date: '0719',
        card_holder_name: 'Ash Ketchum',
        card_cvv: '825'
      }
    }
  )

  t.is(pokemon.stock, 19)
  t.pass()
})
