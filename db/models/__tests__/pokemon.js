import test from 'ava'

import db from '../../'
import { Pokemon } from '../'

test.before('Connect DB', async t => {
  await db.connect()
  t.context.bulba = await new Pokemon({
    name: 'bulbasaur',
    price: 100,
    stock: 10
  })
})

test.serial('restock', async t => {
  const { bulba } = t.context
  bulba.restock(10)
  t.is(bulba.get('stock'), 20)
  t.pass()
})

test.serial('buy', async t => {
  const { bulba } = t.context
  bulba.buy(1)
  t.is(bulba.get('stock'), 19)
  t.pass()
})
