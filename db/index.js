import { Database } from 'mongorito'
import timestamps from 'mongorito-timestamps'

import models from './models'
import { MLAB_USER, MLAB_PASSWORD, MLAB_ENDPOINT, MLAB_DATABASE } from '../env'

export const db = new Database(`mongodb://${MLAB_USER}:${MLAB_PASSWORD}@${MLAB_ENDPOINT}/${MLAB_DATABASE}`)

Object.values()
  .forEach((model) => {
    model.use(timestamps())
    db.register(model)
  })

export default db
