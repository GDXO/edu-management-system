<template>
  <el-container>
    <el-aside width="200px">
      <layout-aside-vue />
    </el-aside>
    <el-container>
      <el-header>
        <layout-header-vue />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import LayoutAsideVue from './components/layout-aside.vue'
import LayoutHeaderVue from './components/layout-header.vue'

export default Vue.extend({
  name: 'LayoutIndex',
  components: {
    LayoutAsideVue,
    LayoutHeaderVue
  }
})
</script>

<style lang="scss" scoped>
.el-container {
  min-height: 100vh;
  min-width: 980px;
}
.el-header,
.el-aside {
  background-color: #F7F9FB;
}

.el-main {
  background-color: #E8EEF4;
}
</style>
