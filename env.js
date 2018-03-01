export const env = {
  prod: process.env.NODE_ENV === 'production',
}

env.protocol = `http${!env.prod ? '' : 's'}`
env.domain = `${env.prod ? 'poke-shop.now.sh': 'localhost'}`
env.appPort = process.env.PORT || (!env.prod ? 3000 : 80)
env.appUrl = `${env.protocol}://${env.domain}:${env.appPort}`

export default env
