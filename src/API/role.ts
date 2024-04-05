/**
 * 角色相关的请求模块
 */
import request from '@/utils/request'

// 获取角色列表
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRoles = (data: any) =>
  request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })

// 删除角色
export const deleteRole = (id: string | number) =>
  request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })

// 添加或更新角色
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrUpdate = (data: any) => request({
  method: 'POST',
  url: '/boss/role/saveOrUpdate',
  data
})

// 根据 ID 获取角色数据
export const getRoleById = (id: string | number) => request({
  method: 'GET',
  url: `/boss/role/${id}`
})

// 获取所有角色
export const getAllRoles = () => request({
  method: 'GET',
  url: '/boss/role/all'
})

// 给用户分配角色
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const allocateUserRoles = (data: any) => request({
  method: 'POST',
  url: '/boss/role/allocateUserRoles',
  data
})

// 根据用户 ID 查询所拥有的角色
export const getUserRoles = (userId: string | number) => request({
  method: 'GET',
  url: `/boss/role/user/${userId}`
})
