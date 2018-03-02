import http from 'http'
import https from 'https'

import Koa from 'koa'
import bodyparser from 'koa-bodyparser'
import cors from '@koa/cors'
import mount from 'koa-mount'
import cert from 'openssl-self-signed-certificate'
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'

import db from '../db'
import { schema } from '../schema'
import env from '../env'

const app = new Koa()

app.use(bodyparser())

app.use(cors())

app.use(mount('/graphql', graphqlKoa({
  schema,
  formatError: ({ message, originalError, locations, path }) => ({
    state: originalError && originalError.state,
    locations,
    message,
    path
  })
})))
app.use(mount('/graphiql', graphiqlKoa({ endpointURL: '/graphql' })))

let server

if (!env.prod) {
  server = https.createServer({
      key: cert.key,
      cert: cert.cert,
      passphrase: cert.passphrase
    }, app.callback())
} else {
  server = http.createServer(app.callback())
}

db.sync()
  .then(() =>
    server.listen(env.appPort, () =>
      console.log(`App running on port ${env.appPort} ${env.appUrl}/graphiql`)
    )
  )
  .catch(err => console.error('DB connection Failed!', err))

export default app
