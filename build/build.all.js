var platform = require('../allPlatform.js')

const shelljs = require('shelljs')
const path = require('path')
const fs = require('fs')
var arr = Object.keys(platform)
var noProduced = [] // 不参与打包
var package = require('../package.json')
var version = package.version

arr.forEach((item, index) => {
  if (!noProduced.includes(item)) {
    try{
      package.version = version
      var datasString = JSON.stringify(package, null, 4)
      fs.writeFileSync(path.join(__dirname, '../package.json'), datasString,'utf8')
      console.log(`this is "${item}" platform`)
      shelljs.exec(`cross-env PLATFORM_ENV=all curPlatformPC=${item} npm run build`)
    }catch (e) {
      console.log(`"${item}" platform 打包错误`)
    }
  }
})





