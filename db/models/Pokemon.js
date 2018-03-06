import { Model } from 'mongorito'

export class Pokemon extends Model {
  restock (quantity) {
    this.set('stock', this.get('stock') + quantity)
  }
  buy (quantity) {
    this.set('stock', this.get('stock') - quantity)
  }
}

export default Pokemon
