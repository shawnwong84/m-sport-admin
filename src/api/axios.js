
import axios from 'axios'
import querystring from 'querystring'
import $router from '../router'

const ax = axios.create({
  timeout: 600000
  // baseURL: 'http://129.226.169.250:8046'
})

ax.interceptors.request.use((config) => {
  if (
    config.method === 'get' ||
    config.method === 'post' ||
    config.method === 'put' ||
    config.method === 'delete' ||
    config.method === 'patch'
  ) {
    if (config.headers['Content-Type'] !== 'application/json') {
      config.data = querystring.stringify(config.data)
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
ax.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    alert('请求超时！请重新登陆')
    $router.push({name: 'login'})
  }
  return Promise.reject(error)
})
export default ax
