import request from '@/utils/request'

// 创建或更新菜单
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrUpdateMenu = (data: any) =>
  request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })

// 获取上级菜单
export const getEditMenuInfo = (id = -1) =>
  request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })

// 获取所有菜单
export const getAllMenus = () => request({
  method: 'GET',
  url: '/boss/menu/getAll'
})

// 删除菜单
export const deleteMenuItem = (id: number) => request({
  method: 'DELETE',
  url: `/boss/menu/${id}`
})
