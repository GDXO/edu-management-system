/**
 * 用户相关的请求模块
 */
import qs from 'qs'

import request from '@/utils/request'

interface LoginUser {
  phone: string
  password: string
}

// 登录请求
export const login = (data: LoginUser) =>
  request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data)
  })

// 获取登录用户请求
export const getUserInfo = () =>
  request({
    method: 'GET',
    url: '/front/user/getInfo'
  })

// 获取用户列表
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserPages = (data: any) =>
  request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
