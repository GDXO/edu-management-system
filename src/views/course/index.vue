<template>
  <div class="courseContainer">
    <el-card class="box-card courseFilterBox">
      <el-form
        :inline="true"
        :model="courseFilterForm"
        ref="courseFilterForm"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input
            v-model="courseFilterForm.courseName"
            placeholder="请输入课程名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="courseFilterForm.status"
            placeholder="请选择课程状态"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            @click="resetForm('courseFilterForm')"
          >重置</el-button>
          <el-button
            type="primary"
            size="small"
            @click="searchCourseFn"
          >查询</el-button>
        </el-form-item>
        <el-form-item class="addCourseBox">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="createCourseFn"
          >新建课程</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card courseTableBox">
      <el-table
        stripe
        v-loading="isLoading"
        :data="courses"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="courseName" label="课程名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13CE66"
              inactive-color="#FF4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.statusIsLoading"
              @change="changeStatusFn(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.status === 0 ? 'success' : 'danger'"
              size="mini"
              >{{ scope.row.status === '0' ? '上架' : '下架' }}</el-button
            >
            <el-button
              size="mini"
              @click="editCourseFn(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              @click="contentManageFn(scope.row)"
            >内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="courseFilterForm.currentPage"
        :page-sizes="[11, 20, 30, 50, 100]"
        :page-size="11"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { getQueryCourses, changeStatus } from '@/API/course'

export default Vue.extend({
  name: 'CourseIndex',
  data () {
    return {
      courseFilterForm: {
        courseName: '',
        status: '',
        currentPage: 1,
        pageSize: 11
      },
      courses: [],
      totalCount: 0,
      isLoading: false
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    // 获取课程列表
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.courseFilterForm)
      this.isLoading = false

      if (data.code === '000000') {
        // 给每条数据添加商家的 loading
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.data.records.forEach((course: any) => {
          course.statusIsLoading = false
        })

        this.courses = data.data.records
        // 分页总条数
        this.totalCount = data.data.total
      }
    },
    // 重置
    resetForm (formName: string) {
      if (formName) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.$refs[formName] as any).resetFields()
      }
    },
    // 查询
    searchCourseFn () {
      this.courseFilterForm.currentPage = 1
      this.loadCourses()
    },
    // 分页操作
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSizeChange (val: any) {
      this.courseFilterForm.pageSize = val
      this.courseFilterForm.currentPage = 1

      // 重新获取数据
      this.loadCourses()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleCurrentChange (val: any) {
      this.courseFilterForm.currentPage = val

      // 重新请求数据
      this.loadCourses()
    },
    // 课程上下架函数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async changeStatusFn (course: any) {
      course.statusIsLoading = true
      const { data } = await changeStatus({
        courseId: course.id,
        status: course.status
      })
      course.statusIsLoading = false

      if (data.code === '000000') {
        this.$message.success(`${course.status === 0 ? '下架' : '上架'}成功`)
      }
    },
    // 新建课程事件
    createCourseFn () {
      this.$router.push({
        name: 'course-create'
      })
    },
    // 编辑课程操作
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editCourseFn (row: any) {
      this.$router.push({
        name: 'course-edit',
        params: {
          courseId: row.id
        }
      })
    },
    // 内容管理函数
    contentManageFn (row) {
      this.$router.push({
        name: 'course-section',
        params: {
          courseId: row.id
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.courseFilterBox {
  background: transparent;
  box-shadow: none;

  .el-form-item {
    margin-bottom: 0;
  }

  .addCourseBox {
    float: right;
  }
}

.courseTableBox {
  .el-table {
    margin-bottom: 15px;
  }
}
</style>
