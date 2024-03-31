<template>
  <div class="loginContainer">
    <!-- 标题 -->
    <p class="loginTitleContainer">Edu 管理系统</p>
    <!-- 表单容器 -->
    <div class="loginFormContainer">
      <!-- 表单标题 -->
      <p class="loginFormTitle">登录</p>
      <!-- 表单 -->
      <el-form
        class="loginForm"
        label-position="top"
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="80px"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="loginForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="loginSubmitBtn"
            type="primary"
            @click="formSubmitFn"
            :loading="isLoginSwitch"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import type { Form } from 'element-ui'
import Vue from 'vue'
import { mapActions } from 'vuex'

import { login } from '@/API/users'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      loginForm: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            pattern: /^1\d{10}/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度为 6 ~ 18 个字符', trigger: 'blur' }
        ]
      },
      isLoginSwitch: false
    }
  },
  methods: {
    ...mapActions(['triggerSetUser']),
    async formSubmitFn () {
      try {
        // 表单验证
        await (this.$refs.loginForm as Form).validate()

        // 按钮 loading
        this.isLoginSwitch = true

        // 请求处理
        const { data } = await login(this.loginForm)

        // 结果处理 => 不成功打印错误消息
        if (data.state !== 1) {
          return this.$message.error(data.message)
        } else {
          // 登录成功 => 记录登录状态(Vuex) => 跳转到首页
          this.$message.success('登录成功!')

          // 记录登录状态
          this.triggerSetUser(data.content)

          this.$router.push((this.$route.query.redirect) as string || '/')
        }
      } catch (err) {
        this.$message.error('登录失败!')
        console.log(err)
      }

      // 结束提交按钮 loading
      this.isLoginSwitch = false
    }
  }
})
</script>

<style lang="scss" scoped>
.loginContainer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .loginTitleContainer {
    color: #7a7e83;
    font-size: 32px;
    margin: 40px 0 60px;
  }

  .loginFormContainer {
    width: 350px;
    background: #fff;
    padding: 10px;
    border-radius: 5px;

    .loginFormTitle {
      margin: 0;
      font-size: 20px;
      color: #333;
      font-weight: 600;
    }

    .loginSubmitBtn {
      width: 100%;
    }
  }
}
</style>
