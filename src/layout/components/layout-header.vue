<template>
  <div class="header">
    <!-- 面包屑 -->
    <breadcrumb />
    <!-- 登录用户 -->
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <el-avatar
          shape="square"
          :size="30"
          :src="userInfo.portrait || defaultAvatar"
        ></el-avatar>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <el-dropdown-item divided @click.native="logoutFn">
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'

import { getUserInfo } from '@/API/users'
import defaultAvatar from '@/assets/images/defaultAvatar.png'

import Breadcrumb from '@/components/breadcrumb/index.vue'

export default Vue.extend({
  name: 'LayoutHeader',
  components: {
    Breadcrumb
  },
  data () {
    return {
      userInfo: {},
      defaultAvatar
    }
  },
  created () {
    this.getUserInfoFn()
  },
  methods: {
    ...mapActions(['triggerSetUser']),
    // 获取用户信息事件
    async getUserInfoFn () {
      const { data } = await getUserInfo()

      this.userInfo = data.content
    },
    // 用户退出事件
    logoutFn () {
      // 确认事件
      this.$confirm('确定退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除用户登录信息
        this.triggerSetUser(null)

        // 跳转到登录页面
        this.$router.push({
          name: 'login'
        })

        // 提示
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出!'
        })
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-dropdown {
    cursor: pointer;
  }
}
</style>
