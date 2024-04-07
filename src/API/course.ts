/**
 * 课程相关请求模块
 */
import request from '@/utils/request'
import { AxiosProgressEvent } from 'axios'

// 查询课程接口
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getQueryCourses = (data: any) =>
  request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })

// 课程上下架
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const changeStatus = (params: any) =>
  request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })

// 保存或更新课程信息
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveOrUpdateCourse = (data: any) =>
  request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })

// 上传图片
export const uploadCourseImg = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) =>
  request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    onUploadProgress
  })

// 根据课程 ID 查询课程详情
export const getCourseById = (courseId: string | number) => request({
  method: 'GET',
  url: '/boss/course/getCourseById',
  params: {
    courseId
  }
})
