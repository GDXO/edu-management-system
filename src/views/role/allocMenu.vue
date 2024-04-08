<template>
  <el-card>
    <div slot="header">
      <span>分配权限</span>
      <el-button style="float: right" size="small" @click="routerBackFn"
        >返回</el-button
      >
    </div>
    <el-tree
      ref="menuTreeRef"
      :data="menuTreeData"
      :props="defaultProps"
      :default-checked-keys="menuCheckedKeys"
      node-key="id"
      show-checkbox
      default-expand-all
    ></el-tree>
    <div class="handleBox">
      <el-button @click="resetChecked">清空</el-button>
      <el-button type="primary" @click="saveMenuPowerFn">保存</el-button>
    </div>
  </el-card>
</template>

<script lang="ts">
import type { Tree } from 'element-ui'
import Vue from 'vue'

import { getMenuNodeList, allocRoleMenus, getRoleMenus } from '@/API/menu'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menuTreeData: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      menuCheckedKeys: []
    }
  },
  created () {
    this.getMenus()
    this.loadRolePowerMenus()
  },
  methods: {
    // 获取菜单树形数据
    async getMenus () {
      const { data } = await getMenuNodeList()

      if (data.code === '000000') {
        this.menuTreeData = data.data
      }
    },
    // 保存菜单权限
    async saveMenuPowerFn () {
      // 获取选中节点列表
      const menuIdList = (this.$refs.menuTreeRef as Tree).getCheckedKeys()

      const { data } = await allocRoleMenus({
        roleId: this.roleId,
        menuIdList
      })

      if (data.code === '000000') {
        this.$message.success('菜单分配成功!')
        this.$router.back()
      }
    },
    // 获取菜角色所拥有的菜单权限
    async loadRolePowerMenus () {
      const { data } = await getRoleMenus(this.roleId)

      if (data.code === '000000') {
        this.getCheckMenusKey(data.data)
      }
    },
    // 获取选中的数据节点
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCheckMenusKey (menus: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      menus.forEach((menu: any) => {
        if (menu.selected) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.menuCheckedKeys = [...this.menuCheckedKeys, (menu.id as never)]
        }

        if (menu.subMenuList && menu.subMenuList.length) {
          this.getCheckMenusKey(menu.subMenuList)
        }
      })
    },
    // 清空组件
    resetChecked () {
      (this.$refs.menuTreeRef as Tree).setCheckedKeys([])
    },
    // 返回上级菜单
    routerBackFn () {
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped>
  .handleBox {
    text-align: right;
  }
</style>
