import {
  pokemons,
  addPokemon,
  buyPokemon,
  restockPokemon
} from './pokemon'
import scalars from './scalars'

export const resolvers = {
  ...scalars,
  Query: {
    pokemons
  },
  Mutation: {
    addPokemon,
    buyPokemon,
    restockPokemon
  }
}

export default resolvers
