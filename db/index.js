import { Database } from 'mongorito'
import timestamps from 'mongorito-timestamps'
import 'dotenv/config'

import models from './models'

const {
  MLAB_USER,
  MLAB_PASSWORD,
  MLAB_ENDPOINT,
  MLAB_DATABASE
} = process.env

export const db = new Database(`mongodb://${MLAB_USER}:${MLAB_PASSWORD}@${MLAB_ENDPOINT}/${MLAB_DATABASE}`)

models.forEach((model) => {
  model.use(timestamps())
  db.register(model)
})

export const connection = db.connect()

export default connection
