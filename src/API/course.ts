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

// 获取课程章节信息
export const getSectionAndLesson = (courseId: string | number) => request({
  method: 'GET',
  url: '/boss/course/section/getSectionAndLesson',
  params: {
    courseId
  }
})

// 保存或更新阶段内容
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveOrUpdateSection = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}

// 保存或更新章节内容
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveOrUpdateLesson = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}
