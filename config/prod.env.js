'use strict'
var version = require('../package.json').version
module.exports = {
  NODE_ENV: '"production"',
  VERSION: `"${version}"`
}
