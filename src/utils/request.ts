import axios from 'axios'

import store from '@/store/'

const request = axios.create({})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 设置统一的 token
    const { user } = store.state

    if (user && user.access_token) {
      config.headers.Authorization = user.access_token
    }

    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器

export default request
