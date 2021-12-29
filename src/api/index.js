import axios from './axios'
import {
  Cookie
} from './util'
import $router from '../router'
// 区分环境（正式，开发）
let urlPrefix = '/sequoiaBack'
// if (process.env.NODE_ENV !== 'production') {
//   urlPrefix = '/api'
// }
export default {
  install (Vue) {
    Vue.prototype.$axios = (mode, url, param, head) => {
      return this.axiosRequest(mode, url, param, head)
    }
  },
  axiosRequest (mode = 'post', url, param, head = {}) {
    return this.ax(mode, url, param, head)
  },
  ax (mode, url, param, head) {
    let rewriteUrl = url
    if (mode === 'get') {
      rewriteUrl += (param || '')
    }
    if (Cookie.get('token')) {
      head = {
        'token': Cookie.get('token'),
        'Content-Type': 'application/json'
      }
    } else {
      head = {
        'Content-Type': 'application/json'
      }
    }
    let headers = {
      headers: head
    }
    let paramUrl = urlPrefix + rewriteUrl
    return new Promise((resolve, reject) => {
      axios[mode](paramUrl, param, headers).then((response) => {
        let data = response.data
        resolve(data)
        if (data.code === '10002') {
          $router.push({name: 'login'})
        }
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
