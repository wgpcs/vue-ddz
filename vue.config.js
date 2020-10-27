'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue poker game' // page title
// const port = process.env.port || process.env.npm_config_port || 9528 // dev port

module.exports = {
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        components: resolve('src/components'),
        assets: resolve('src/assets'),
        css: resolve('src/styles')
      }
    }
  },

  css: {
    // 配置css模块
    loaderOptions: {
      // 向预处理器 Loader 传递配置选项
      stylus: {
        // 配置less（其他样式解析用法一致）
        javascriptEnabled: true // 设置为true
      },
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 18.75
          })
        ]
      }
    }
  }

  // chainWebpack: config => {
  //   config.module
  //     .rule('css')
  //     .test(/\.styl$/)
  //     .oneOf('vue')
  //     .resourceQuery(/\?vue/)
  //     .use('px2rem')
  //     .loader('px2rem-loader')
  //     .options({
  //       remUnit: 75
  //     })
  // }
}
