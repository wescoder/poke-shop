import http from 'http'
import https from 'https'

import Koa from 'koa'
import bodyparser from 'koa-bodyparser'
import cors from '@koa/cors'
import mount from 'koa-mount'
import cert from 'openssl-self-signed-certificate'
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'

import db from '../db'
import schema from '../schema'
import { IS_PROD, APP_PORT, APP_URL } from '../env'

const app = new Koa()

app.use(cors())
app.use(bodyparser())

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

db.connect()
  .then(() => {
    let server
    if (IS_PROD) {
      server = http.createServer(app.callback())
    } else {
      server = https.createServer(cert, app.callback())
    }
    server.listen(APP_PORT, () =>
      console.log(`App running on port ${APP_PORT} ${APP_URL}/graphiql`)
    )
  })
  .catch(err => console.error('DB connection Failed!', err))

export default app
