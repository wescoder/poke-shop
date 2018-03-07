import { Database } from 'mongorito'
import timestamps from 'mongorito-timestamps'

import { MLAB_USER, MLAB_PASSWORD, MLAB_ENDPOINT, MLAB_DATABASE } from '../env'
import models from './models'

export const db = new Database(`mongodb://${MLAB_USER}:${MLAB_PASSWORD}@${MLAB_ENDPOINT}/${MLAB_DATABASE}`)

Object.keys(models).forEach((k) => {
  const model = models[k]
  model.use(timestamps())
  db.register(model)
})

export default db
