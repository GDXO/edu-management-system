<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
      <el-button
        size="small"
        type="success"
        class="backMenuBtn"
        @click="backMenuFn"
        >返回</el-button
      >
    </div>
    <el-form ref="menuForm" :model="menuForm" :rules="rules" label-width="85px">
      <el-form-item label="菜单名称:" prop="name">
        <el-input v-model="menuForm.name"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径:">
        <el-input v-model="menuForm.href"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单:">
        <el-select v-model="menuForm.parentId" placeholder="请选择上级菜单">
          <el-option :value="-1" label="无上级菜单"></el-option>
          <el-option
            v-for="menuItem of parentMenuList"
            :key="menuItem.id"
            :label="menuItem.name"
            :value="menuItem.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input v-model="menuForm.description"></el-input>
      </el-form-item>
      <el-form-item label="前端图标:" prop="icon">
        <el-input v-model="menuForm.icon"></el-input>
      </el-form-item>
      <el-form-item label="是否显示:">
        <el-radio-group v-model="menuForm.shown">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序:">
        <el-input-number v-model="menuForm.orderNum"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="createMenuSubmitFn"
          >提交</el-button
        >
        <el-button v-if="!isEdit">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import type { Form } from 'element-ui'
import Vue from 'vue'

import { createOrUpdateMenu, getEditMenuInfo } from '@/API/menu'

export default Vue.extend({
  name: 'MenuCreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      menuForm: {
        name: '',
        href: '',
        parentId: -1,
        description: '',
        icon: '',
        shown: false,
        orderNum: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 3, message: '长度不能小于3个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述内容', trigger: 'blur' }
        ],
        icon: [{ required: true, message: '请输入前端图标', trigger: 'blur' }]
      },
      submitBtnLoading: false,
      parentMenuList: []
    }
  },
  created () {
    this.loadMenuInfo()
  },
  methods: {
    // 获取菜单信息
    async loadMenuInfo () {
      if (this.$route.params.id) {
        const { data } = await getEditMenuInfo((this.$route.params.id as number) || -1)

        // 当前菜单信息
        if (data.data.menuInfo) {
          this.menuForm = data.data.menuInfo
        }

        // 展示父级节点
        this.parentMenuList = data.data.parentMenuList
      }
    },
    // 添加菜单提交
    async createMenuSubmitFn () {
      try {
        // 表单验证
        await (this.$refs.menuForm as Form).validate()

        // 提交按钮 loading
        this.submitBtnLoading = true

        // 创建菜单
        const { data } = await createOrUpdateMenu(this.menuForm)

        // 创建成功, 跳转到原来的位置
        if (data.code === '000000') {
          this.$message.success('添加菜单成功!')
          this.$router.back()
        }
      } catch (err) {
        this.$message.error('添加菜单失败!')
        console.log(err)
      }
    },
    // 返回按钮
    backMenuFn () {
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped>
.backMenuBtn {
  float: right;
}
</style>
