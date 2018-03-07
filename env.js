import { config } from 'dotenv'
import { resolve } from 'path'

const { NODE_ENV } = process.env
const envPath = resolve(__dirname, `.env${NODE_ENV !== 'production' ? `.${NODE_ENV}` : ''}`)

config({
  path: envPath
})

const {
  PORT,
  PAYMENT_API,
  PAYMENT_API_KEY,
  MLAB_USER,
  MLAB_PASSWORD,
  MLAB_ENDPOINT,
  MLAB_DATABASE
} = process.env

const env = {
  NODE_ENV,
  MLAB_USER,
  MLAB_PASSWORD,
  MLAB_ENDPOINT,
  MLAB_DATABASE,
  PAYMENT_API,
  PAYMENT_API_KEY
}

const IS_PROD = env.IS_PROD = NODE_ENV === 'production'
const DOMAIN = env.DOMAIN = `${IS_PROD ? 'poke-shop.now.sh': 'localhost'}`
const APP_PORT = env.APP_PORT = PORT || (IS_PROD ? 80 : 3000)
const APP_URL = env.APP_URL = `https://${DOMAIN}${APP_PORT !== 80 ? `:${APP_PORT}` : ''}`

export {
  IS_PROD,
  NODE_ENV,
  MLAB_USER,
  MLAB_PASSWORD,
  MLAB_ENDPOINT,
  MLAB_DATABASE,
  PAYMENT_API,
  PAYMENT_API_KEY,
  DOMAIN,
  APP_PORT,
  APP_URL
}

export default {
  IS_PROD,
  NODE_ENV,
  MLAB_USER,
  MLAB_PASSWORD,
  MLAB_ENDPOINT,
  MLAB_DATABASE,
  PAYMENT_API,
  PAYMENT_API_KEY,
  DOMAIN,
  APP_PORT,
  APP_URL
}
