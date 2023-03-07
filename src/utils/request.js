/*
 * @LastEditTime: 2023-03-07 10:43:46
 * @Descripttion: 
 */
import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import qs from 'qs'
// 创建 axios 实例 
const request = axios.create({
  // API 请求的默认前缀
  baseURL: storage.get('baseURL'),
  timeout: 60000, // 请求超时时间(60s)
  withCredentials: false, // 允许携带cookie
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: function (data, headers) {
    return qs.stringify(data)
  }// 请求超时时间
})
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (config.baseURL === undefined) {
    config.baseURL = storage.get('baseURL')
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['apiAuth'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  // if (response.data.HttpStatusCode === 401 && response.data.Message === '登录权限过期') {
  //   alert('当前登录已过期，请重新登录')
  //   window.location.href = '/user/login'
  //   return
  // }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
