export const env = {
  prod: process.env.NODE_ENV === 'production',
}

env.domain = `${env.prod ? 'poke-shop.now.sh': 'localhost'}`
env.appPort = process.env.PORT || (env.prod ? 80 : 3000)
env.appUrl = `https://${env.domain}:${env.appPort}`
env.paymentEndpoint = process.env.PAYMENT_API || 'https://api.pagar.me/1/transactions'
env.paymentAPIKey = process.env.PAYMENT_API_KEY

export default env
