import axios from 'axios'
import { Message } from 'element-ui'
import qs from 'qs'

import store from '@/store/'
import router from '@/router/'

const request = axios.create({})

// 跳转到 登录页 函数
function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

// refresh_token => access_token 函数
function refreshTokenFn () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 设置统一的 token
    const { user } = store.state

    if (user && user.access_token) {
      if (config.headers) {
        config.headers.Authorization = user.access_token
      }
    }

    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
let isRefreshing = false // 正在刷新开关
let requests: (() => void)[] = [] // 请求数组
request.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    if (error.response) {
      // 请求收到响应了, 但是状态码超出了 2xx 范围
      const { status } = error.response

      if (status === 400) {
        Message.error('请求参数错误!')
      } else if (status === 401) {
        // token 无效 => 有 refresh_token, 使用 refresh_token 获取新的 access_token
        if (!store.state.user) {
          redirectLogin()
          return Promise.reject(error)
        }

        if (!isRefreshing) {
          isRefreshing = true

          refreshTokenFn()
            .then(res => {
              if (!res.data.success) {
                throw new Error('刷新 token 失败!')
              }

              // 成功 => 把本次失败的请求重新发出去
              // 存储新的 token 信息
              store.dispatch('triggerSetUser', res.data.content)

              // 把 requests 中的请求重新发出去
              requests.forEach(cb => cb())

              // 重置 requests
              requests = []

              // 重新发送失败的请求
              return request(error.config)
            })
            .catch(() => {
              // 失败 => 跳转到登录页
              // 清除当前人员的信息
              store.dispatch('triggerSetUser', null)
              redirectLogin()
              return Promise.reject(error)
            })
            .finally(() => {
              // 重置刷新状态
              isRefreshing = false
            })
        }

        return new Promise(resolve => {
          requests.push(() => {
            resolve(request(error.config))
          })
        })
      } else if (status === 403) {
        Message.error('没有权限, 请联系管理员!')
      } else if (status === 404) {
        Message.error('请求资源不存在!')
      } else if (status >= 500) {
        Message.error('服务器错误, 请联系管理员!')
      }
    } else if (error.request) {
      // 请求发出了, 没有收到响应
      Message.error('请求超时, 请刷新重试!')
    } else {
      // 在设置请求时, 触发了一些错误
      Message.error(`请求发生错误: ${error.message}`)
    }
    return Promise.reject(error)
  }
)

export default request
