<template>
  <div class="handleCourseContainer">
    <el-steps :active="activeStep" simple>
      <el-step
        v-for="(step, index) of steps"
        :key="index"
        :title="step.title"
        :icon="step.icon"
        @click.native="skipIndexStepFn(index)"
      ></el-step>
    </el-steps>
    <el-card class="box-card formContentBox">
      <!-- 表单内容 -->
      <el-form label-width="80px">
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="courseForm.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="courseForm.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              type="textarea"
              v-model="courseForm.previewFirstField"
              placeholder="概述1"
              style="margin-bottom: 10px"
            ></el-input>
            <el-input
              type="textarea"
              v-model="courseForm.previewSecondField"
              placeholder="概述2"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="courseForm.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input
              type="textarea"
              v-model="courseForm.teacherDTO.description"
            ></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number v-model="courseForm.sortNum"></el-input-number>
          </el-form-item>
        </div>
        <div v-show="activeStep === 1">
          <el-form-item label="课程封面">
            <course-image v-model="courseForm.courseListImg" />
          </el-form-item>
          <el-form-item label="介绍封面">
            <course-image v-model="courseForm.courseImgUrl" />
          </el-form-item>
        </div>
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input
              placeholder="请输入售卖价格"
              v-model.number="courseForm.discounts"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input
              placeholder="请输入商品原价"
              v-model.number="courseForm.price"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input
              placeholder="请输入销量"
              v-model.number="courseForm.sales"
            >
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input
              placeholder="请输入活动标签"
              v-model="courseForm.discountsTag"
            ></el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关" label-width="120px">
            <el-switch
              v-model="courseForm.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <template v-if="courseForm.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                type="date"
                placeholder="选择开始时间"
                value-format="yyyy-MM-dd"
                v-model="courseForm.activityCourseDTO.beginTime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                type="date"
                placeholder="选择结束时间"
                value-format="yyyy-MM-dd"
                v-model="courseForm.activityCourseDTO.endTime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input
                placeholder="请输入秒杀价"
                v-model.number="courseForm.activityCourseDTO.amount"
                type="number"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input
                placeholder="请输入秒杀库存"
                type="number"
                v-model.number="courseForm.activityCourseDTO.stock"
              >
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <text-editor v-model="courseForm.courseDescriptionMarkDown" />
          </el-form-item>
          <el-form-item label="是否发布">
            <el-switch
              v-model="courseForm.status"
              active-color="#13CE66"
              inactive-color="#FF4949"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </div>
        <el-form-item
          class="nextStepBox"
          v-if="activeStep >= 0 && activeStep < steps.length - 1"
        >
          <el-button type="primary" size="small" @click="nextStepFn"
            >下一步</el-button
          >
        </el-form-item>
        <el-form-item v-else class="createCourseSubmitBox">
          <el-button
            type="primary"
            size="small"
            @click="handleCourseSubmit"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

import CourseImage from './courseImage.vue'
import TextEditor from '@/components/textEditor/index.vue'
import { saveOrUpdateCourse, getCourseById } from '@/API/course'

export default Vue.extend({
  name: 'CreateOrUpdateCourse',
  components: {
    CourseImage,
    TextEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-info' },
        { title: '课程封面', icon: 'el-icon-tickets' },
        { title: '销售信息', icon: 'el-icon-s-order' },
        { title: '秒杀活动', icon: 'el-icon-present' },
        { title: '课程详情', icon: 'el-icon-notebook-1' }
      ],
      imageUrl: '',
      courseForm: {
        courseName: '',
        brief: '',
        teacherDTO: {
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: false, // 是否开启限时秒杀
        activityCourseDTO: {
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadThisCourse()
    }
  },
  methods: {
    // 步骤条 下一步
    nextStepFn () {
      this.activeStep++
    },
    // 步骤条 头部点击
    skipIndexStepFn (index: number) {
      this.activeStep = index
    },
    // 保存按钮提交事件
    async handleCourseSubmit () {
      const { data } = await saveOrUpdateCourse(this.courseForm)

      if (data.code === '000000') {
        this.$router.back()
      }
    },
    // 根据课程 ID 查询相应的课程
    async loadThisCourse () {
      const { data } = await getCourseById(this.courseId)

      if (data.code === '000000') {
        const { activityCourse } = data.data

        // 处理时间格式
        if (activityCourse) {
          const { activityCourseDTO } = data.data

          activityCourseDTO.beginTime = moment(activityCourseDTO.beginTime).format('YYYY-MM-DD')
          activityCourseDTO.endTime = moment(activityCourseDTO.endTime).format('YYYY-MM-DD')
        }

        // 赋值表单数据
        this.courseForm = data.data
      }
    }
  }
})
</script>

<style lang='scss' scoped>
.el-steps {
  cursor: pointer;
}

.formContentBox {
  margin-top: 15px;

  .nextStepBox,
  .createCourseSubmitBox {
    text-align: right;
    margin-bottom: 0;
  }
}
</style>
