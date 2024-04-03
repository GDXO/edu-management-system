<template>
  <div>
    <el-card class="box-card resourceFilterBox">
      <el-form
        :inline="true"
        :model="resourceFilterForm"
        ref="resourceFilterForm"
        class="demo-form-inline resourceFilterForm"
        size="small"
      >
        <el-form-item prop="name" label="资源名称:">
          <el-input
            v-model="resourceFilterForm.name"
            placeholder="请输入资源名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="url" label="资源路径:">
          <el-input
            v-model="resourceFilterForm.url"
            placeholder="请输入资源路径"
          ></el-input>
        </el-form-item>
        <el-form-item prop="categoryId" label="资源分类:">
          <el-select
            v-model="resourceFilterForm.categoryId"
            placeholder="请选择资源分类"
            clearable
          >
            <el-option
              v-for="categoryItem of categoryList"
              :key="categoryItem.id"
              :label="categoryItem.name"
              :value="categoryItem.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetFilterFn" :disabled="isLoading"
            >重置</el-button
          >
          <el-button
            type="primary"
            @click="filterResourceFn"
            :disabled="isLoading"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card resourceListBox">
      <div slot="header" class="clearfix">
        <el-button @click="addResourceFn" size="small">添加</el-button>
        <el-button @click="resourceClassifyFn" size="small">资源分类</el-button>
      </div>
      <el-table
        :data="resourceTableData"
        stripe
        v-loading="isLoading"
        style="width: 100%; margin-bottom: 15px"
      >
        <el-table-column label="编号" type="index"></el-table-column>
        <el-table-column prop="name" label="资源名称"></el-table-column>
        <el-table-column prop="url" label="资源路径"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间"
          :formatter="formateDate"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small"
              >编辑</el-button
            >
            <el-button @click="handleDelete(scope.row)" type="text" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="resourceFilterForm.current"
        :page-sizes="[8, 15, 30, 50]"
        :page-size="resourceFilterForm.size"
        :total="totalCount"
        :disabled="isLoading"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

import { getResourcePages, getResourceCategory } from '@/API/resource'

export default Vue.extend({
  name: 'SourceList',
  data () {
    return {
      categoryList: [],
      resourceFilterForm: {
        name: '',
        url: '',
        categoryId: null,
        current: 1,
        size: 8
      },
      resourceTableData: [],
      totalCount: 0,
      isLoading: false
    }
  },
  created () {
    // 获取所有资源分类
    this.getResourceCategoryList()
    // 获取资源列表
    this.getResourceList()
  },
  methods: {
    // 获取资源分类列表
    async getResourceCategoryList () {
      const { data } = await getResourceCategory()

      if (data.code === '000000') {
        this.categoryList = data.data
      }
    },
    // 筛选查询按钮点击事件
    filterResourceFn () {
      this.resourceFilterForm.current = 1
      this.getResourceList()
    },
    // 筛选查询重置
    resetFilterFn () {
      this.$refs.resourceFilterForm.resetFields()
      this.resourceFilterForm.current = 1
      this.getResourceList()
    },
    // 获取列表数据
    async getResourceList () {
      this.isLoading = true
      const { data } = await getResourcePages(this.resourceFilterForm)
      this.isLoading = false

      if (data.code === '000000') {
        this.resourceTableData = data.data.records
        this.totalCount = data.data.total
      }
    },
    // 格式化时间
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formateDate (row, column, cellValue) {
      return moment().format('YYYY-MM-DD hh:mm:ss')
    },
    // 分页事件
    handleSizeChange (val: number) {
      this.resourceFilterForm.size = val
      this.resourceFilterForm.current = 1
      this.getResourceList()
    },
    handleCurrentChange (val: number) {
      this.resourceFilterForm.current = val
      this.getResourceList()
    },
    // 添加资源事件
    addResourceFn () {
      console.log('添加资源')
    },
    // 资源分类事件
    resourceClassifyFn () {
      console.log('资源分类')
    }
  }
})
</script>

<style lang="scss" scoped>
.resourceFilterBox {
  margin-bottom: 10px;

  .resourceFilterForm {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
