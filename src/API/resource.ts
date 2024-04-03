/**
 * 资源相关的请求模块
 */
import request from '@/utils/request'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getResourcePages = (data: any) => request({
  method: 'POST',
  url: '/boss/resource/getResourcePages',
  data
})

// 获取资源分类
export const getResourceCategory = () => request({
  method: 'GET',
  url: '/boss/resource/category/getAll'
})
