<template>
  <el-form
    label-position="top"
    label-width="80px"
    :model="roleForm"
    :rules="rules"
  >
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="roleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="角色编码" prop="code">
      <el-input v-model="roleForm.code"></el-input>
    </el-form-item>
    <el-form-item label="角色描述">
      <el-input v-model="roleForm.description"></el-input>
    </el-form-item>
    <el-form-item class="handleBox">
      <el-button type="primary" @click="createOrUpdateSubmitFn">确认</el-button>
      <el-button @click="cancelDialogFn">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue from 'vue'

import { createOrUpdate, getRoleById } from '@/API/role'

export default Vue.extend({
  name: 'RoleCreateOrEdit',
  props: {
    roleId: [String, Number],
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      roleForm: {
        name: '',
        code: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '角色编码不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRoleInfo()
    }
  },
  methods: {
    // 创建或编辑角色
    async createOrUpdateSubmitFn () {
      // 表单验证
      // 提交表单
      const { data } = await createOrUpdate(this.roleForm)

      if (data.code === '000000') {
        this.$message.success(this.isEdit ? '编辑角色成功!' : '添加角色成功!')
        this.$emit('createOrEditSuccess')
      }
    },
    // 取消创建或编辑角色
    cancelDialogFn () {
      this.$emit('cancelHandle')
    },
    // 根据角色 ID 查询 角色信息
    async loadRoleInfo () {
      const { data } = await getRoleById(this.roleId)

      this.roleForm = data.data
    }
  }
})
</script>

<style lang="scss" scoped>
.handleBox {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
}
</style>
