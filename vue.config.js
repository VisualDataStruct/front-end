'use strict'

var cc = {}
try {
  cc = require('./.config')
} catch (e) {
  cc = require('./.config.js.example')
}
module.exports = {
  productionSourceMap: false,
 
  devServer: {
    host: cc.dev.host,
    port: cc.dev.port,
    https: false,
    open: false,
    proxy: {
      '/api': {
        target: cc.api.host,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': cc.api.prefix
        }
      },
    }
  }
};