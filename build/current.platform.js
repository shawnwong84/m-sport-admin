var platform = null
if (process.env.PLATFORM_ENV !== 'all') {
  let name = require('../platform.js')
  platform = {name:name}
} else {
  platform = {name:process.env.curPlatformPC}
}

module.exports = platform
