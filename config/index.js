'use strict'
// Template version: 1.2.5
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
var platform = require('../build/current.platform.js')
// 项目根目录
const root = path.resolve(__dirname, '..')
// 项目名称
const projectName = platform.name
// 输出目录名字
const dirName = 'zbht'
// 输出目录路径
const outputPath = path.resolve(root, 'output/', projectName, platform.name + '_h5' + '_' + dirName, dirName)
// 获取本地IP
const localAddress = (function () {
  var os = require('os')
  var ifaces = os.networkInterfaces()
  var address = ''

  try {
    for (var dev in ifaces) {
      address = ifaces[dev][1].address
      break
    }
  } catch (e) {
    return 'localhost'
  }
  return address
}())
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/sequoiaBack': {
        target: 'http://api.mzhibo.cc',
        pathRewrite: {'^/sequoiaBack': '/sequoiaBack'},
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false // 设置支持https协议的代理
      }
    },

    // Various Dev Server settings
    host: localAddress, // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    // Template for index.html
    index: path.resolve(outputPath, 'index.html'),

    // Paths
    assetsRoot: outputPath,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/' + dirName + '/',

    /**
     * Source Maps
     */
    productionSourceMap: false,
    // productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
