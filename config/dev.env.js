'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  API_ENDPOINT: '"http://localhost:8000"',
  COOKIE_DOMAIN: '"localhost"'
})
