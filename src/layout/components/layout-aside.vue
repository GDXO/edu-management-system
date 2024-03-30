<template>
  <el-menu
    default-active="/role"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    text-color="#666"
    active-text-color="#ffd04b"
    router
  >
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-user"></i>
        <span>权限管理</span>
      </template>
      <el-menu-item index="/role">
        <i class="el-icon-lock"></i>
        <span slot="title">角色管理</span>
      </el-menu-item>
      <el-menu-item index="/menu">
        <i class="el-icon-lock"></i>
        <span slot="title">菜单管理</span>
      </el-menu-item>
      <el-menu-item index="/resource">
        <i class="el-icon-lock"></i>
        <span slot="title">资源管理</span>
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="/course">
      <i class="el-icon-film"></i>
      <span slot="title">课程管理</span>
    </el-menu-item>
    <el-menu-item index="/user">
      <i class="el-icon-user"></i>
      <span slot="title">用户管理</span>
    </el-menu-item>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span>广告管理</span>
      </template>
      <el-menu-item index="/advert">
        <i class="el-icon-setting"></i>
        <span slot="title">广告列表</span>
      </el-menu-item>
      <el-menu-item index="/advert-space">
        <i class="el-icon-setting"></i>
        <span slot="title">广告位管理</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LayoutAside',
  methods: {
    handleOpen (key: string, keyPath: string): void {
      console.log(key, keyPath)
    },
    handleClose (key: string, keyPath: string): void {
      console.log(key, keyPath)
    }
  }
})
</script>

<style lang="scss" scoped>
.el-menu {
  height: 100%;
}
</style>
