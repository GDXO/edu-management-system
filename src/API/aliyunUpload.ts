/**
 * 阿里云上传相关请求模块
 */
import request from '@/utils/request'

export const getAliyunImageUploadAddressAuth = () => request({
  method: 'GET',
  url: '/boss/course/upload/aliyunImagUploadAddressAdnAuth.json'
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getALiyunVideoUploadAddressAuth = (params: any) => request({
  method: 'GET',
  url: '/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json',
  params
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const aliyunTransCode = (data: any) => request({
  method: 'POST',
  url: '/boss/course/upload/aliyunTransCode.json',
  data
})

export const getAliyunTransCodePercent = (lessonId: string | number) => request({
  method: 'GET',
  url: '/boss/course/upload/aliyunTransCodePercent.json',
  params: {
    lessonId
  }
})
