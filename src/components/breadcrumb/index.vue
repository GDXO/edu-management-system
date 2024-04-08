<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="record of matchRecords"
      :key="record.path"
    >{{ record.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'BreadcrumbIndex',
  computed: {
    matchRecords () {
      const matched = this.$route.matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
      console.log(matched)
      return matched
    }
  }
})
</script>
