'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'components': resolve('src/components'),
        'assets': resolve('src/assets'),
        'css': resolve('src/styles')
      }
    }
  },
}