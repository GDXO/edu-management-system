<template>
  <el-card>
    <div slot="header">
      <el-button
        type="text"
        icon="el-icon-back"
        class="backToCourse"
        @click="backCourseFn"
      >返回</el-button>
      <span class="courseNameText">{{ course.courseName }}</span>
      <!-- 添加阶段 -->
      <el-button
        @click="addCourseStageFn"
        type="primary"
        style="float: right;"
      >添加阶段</el-button>
    </div>
    <div class="courseContentBox">
      <el-tree
        node-key="id"
        :data="sections"
        :props="defaultProps"
        :expand-on-click-node="false"
        :allow-drop="handleAllowDropFn"
        @node-drop="handleSortNodeFn"
        v-loading="isLoading"
        class="contentTreeBox"
        draggable
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <!-- section -->
          <span v-if="data.sectionName">
            <el-button
              size="mini"
              @click="editCourseStageFn(data)"
            >编辑</el-button>
            <el-button
              type="primary"
              size="mini"
            >
              添加课时
            </el-button>
            <el-select
              class="selectStatus"
              v-model="data.status"
              placeholder="请选择状态"
              @change="handleSectionStatusChangeFn(data)"
            >
              <el-option :value="0" label="已隐藏"></el-option>
              <el-option :value="1" label="待更新"></el-option>
              <el-option :value="2" label="已更新"></el-option>
            </el-select>
          </span>
          <!-- lesson -->
          <span v-else>
            <el-button size="mini">编辑</el-button>
            <el-button
              type="success"
              size="mini"
              @click="uploadVideoFn(node, data)"
            >
              上传视频
            </el-button>
            <el-button size="mini">状态</el-button>
          </span>
        </div>
      </el-tree>
    </div>

    <!-- 阶段操作框 -->
    <el-dialog
      :title="`${isEditCourseStage ? '编辑' : '添加'}课程阶段`"
      :visible.sync="stageDialogVisible"
      width="30%"
    >
      <el-form
        :model="section"
        label-width="80px"
        ref="sectionForm"
      >
        <el-form-item label="课程名称">
          <el-input
            v-model="course.courseName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="章节名称">
          <el-input
            v-model="section.sectionName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="章节描述">
          <el-input
            v-model="section.description"
            type="textarea"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model.number="section.orderNum"
            autocomplete="off"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stageDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCourseStageFn"
        >确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import type { Form } from 'element-ui'

import Vue from 'vue'

import {
  getSectionAndLesson,
  getCourseById,
  saveOrUpdateSection,
  saveOrUpdateLesson
} from '@/API/course'

export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    const defaultProps = {
      children: 'lessonDTOS',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      label (data: any) {
        return data.sectionName || data.theme
      }
    }

    const section = {
      courseId: this.courseId,
      sectionName: '',
      description: '',
      orderNum: 0,
      status: 0
    }

    return {
      sections: [],
      section,
      defaultProps,
      course: {},
      isEditCourseStage: false, // 编辑课程阶段
      stageDialogVisible: false, // 阶段操作弹窗显示与隐藏
      isLoading: false // 树加载状态
    }
  },
  created () {
    // 请求课程信息
    this.loadSections()

    // 获取课程信息
    this.loadCourse()
  },
  methods: {
    // 返回课程管理页面
    backCourseFn () {
      this.$router.back()
    },
    // 请求课程信息函数
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)

      if (data.code === '000000') {
        this.sections = data.data
      }
    },
    // 请求课程信息函数
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)

      if (data.code === '000000') {
        this.course = data.data
      }
    },
    // 添加课程阶段
    addCourseStageFn () {
      // 防止数据还是编辑时的数据
      this.section = {
        courseId: this.courseId,
        sectionName: '',
        description: '',
        orderNum: 0,
        status: 0
      }

      this.isEditCourseStage = false
      this.stageDialogVisible = true
    },
    // 课程阶段点击事件
    async handleCourseStageFn () {
      const { data } = await saveOrUpdateSection(this.section)

      if (data.code === '000000') {
        this.$message.success('添加阶段成功!')

        // 重置表单项
        ;(this.$refs.sectionForm as Form).resetFields()

        // 重新加载数据
        this.loadSections()

        // 隐藏弹窗
        this.stageDialogVisible = false
      }
    },
    // 编辑课程阶段
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editCourseStageFn (section: any) {
      this.section = {
        sectionName: section.sectionName,
        id: section.id,
        description: section.description,
        orderNum: section.orderNum,
        courseId: this.courseId,
        theme: '',
        duration: 0,
        isFree: false,
        status: 0
      }

      this.isEditCourseStage = true
      this.stageDialogVisible = true
    },
    // 课程阶段状态编程事件
    async handleSectionStatusChangeFn (section) {
      const { data } = await saveOrUpdateSection(section)

      if (data.code === '000000') {
        this.$message.success('状态已修改!')
      }
    },
    // 阶段拖拽放置位置
    handleAllowDropFn (draggingNode, dropNode, type) {
      // draggingNode: 拖动的节点
      // dropNode: 放置的目标节点
      // type: 'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后

      return (
        draggingNode.data.sectionId === dropNode.data.sectionId &&
        type !== 'inner'
      )
    },
    // 课程内容拖拽完成后事件
    async handleSortNodeFn (dragNode, dropNode) {
      this.isLoading = true

      try {
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          if (dragNode.data.lessonDTOS) {
            // 阶段
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            // 课时
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))

        this.$message.success('排序成功!')
      } catch (err) {
        console.log(err)
        this.$message.error('排序出错!')
      }

      this.isLoading = false
    },
    // 跳转到上传课时页面
    uploadVideoFn (node, lesson) {
      const queryObj = JSON.stringify({
        courseName: this.course.courseName,
        sectionName: node.parent.data.sectionName,
        lessonTime: lesson.durationNum,
        lessonId: lesson.id
      })

      this.$router.push({
        name: 'course-video',
        params: {
          courseId: (this.courseId as string)
        },
        query: {
          lessonInfo: encodeURIComponent(queryObj)
        }
      })
    }
  }
})
</script>

<style lang='scss' scoped>
.backToCourse {
  margin-right: 6px;
  color: #409EFF;
}
.courseNameText {
  padding-left: 6px;
  border-left: 1px solid #CCC;
}

.contentTreeBox {

  ::v-deep .el-tree-node__content {
    height: 50px;
    border-bottom: 1px solid #F4F4F4;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;

    .selectStatus {
      max-width: 90px;
      margin-left: 8px;

      ::v-deep input {
        height: 28px;
      }

      ::v-deep .el-input__icon {
        height: 28px;
        line-height: 28px;
      }
    }
  }
}
</style>
