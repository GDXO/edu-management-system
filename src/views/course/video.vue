<template>
  <el-card>
    <div slot="header">
      <div>课程：{{ lessonInfo.courseName }}</div>
      <div>阶段：{{ lessonInfo.sectionName }}</div>
      <div>课时：{{ lessonInfo.lessonTime }}</div>
    </div>
    <el-form label-width="40px">
      <el-form-item label="视频">
        <input ref="videoFile" type="file" />
      </el-form-item>
      <el-form-item label="封面">
        <input ref="imageFile" type="file" />
      </el-form-item>
      <el-form-item class="handleVideoBox">
        <el-button type="primary" @click="startUploadFn">开始上传</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
      <el-form-item>
        <p v-if="isUpload">视频上传进度: {{ uploadPercent }}%</p>
        <p v-if="isUploadSuccess">
          视频转码中:
          {{ isTransCodeSuccess ? '转码完成' : '正在转码, 请稍等...' }}
        </p>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'

import {
  getAliyunImageUploadAddressAuth,
  getALiyunVideoUploadAddressAuth,
  aliyunTransCode,
  getAliyunTransCodePercent
} from '@/API/aliyunUpload'

export default Vue.extend({
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      uploader: null,
      lessonInfo: {},
      imageURL: '',
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTransCodeSuccess: false,
      isUpload: false
    }
  },
  computed: {
    video () {
      return this.$refs.videoFile
    },
    image () {
      return this.$refs.imageFile
    }
  },
  created () {
    // 获取课时信息
    this.loadLessonInfo()

    // 初始化上传控件
    this.initUploader()
  },
  methods: {
    // 获取课时信息
    loadLessonInfo () {
      if (this.$route.query.lessonInfo) {
        const lessonInfo = decodeURIComponent(this.$route.query.lessonInfo)
        this.lessonInfo = JSON.parse(lessonInfo)
      }
    },
    // 初始化上传控件
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，您可以使用阿里云账号访问账号中心（https://account.console.aliyun.com/），即可查看账号ID
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，
        // eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB（100*1024）
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async uploadInfo => {
          // 获取上传凭证
          let uploadAddressAndAuth
          if (uploadInfo.isImage) {
            const { data } = await getAliyunImageUploadAddressAuth()

            if (data.code === '000000') {
              this.imageURL = data.data.imageURL

              // 上传凭证保存
              uploadAddressAndAuth = data.data
            }
          } else {
            const { data } = await getALiyunVideoUploadAddressAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })

            if (data.code === '000000') {
              // 上传凭证保存
              uploadAddressAndAuth = data.data

              // 保存视频 ID
              this.videoId = data.data.videoId
            }
          }

          // 调用 uploader.setUploadAuthAndAddress 设置上传凭证
          const { uploadAuth, uploadAddress } = uploadAddressAndAuth
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAuth,
            uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )

          this.isUpload = true
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 全部文件上传结束
        onUploadEnd: async () => {
          this.isUploadSuccess = true

          // 所有文件上传成功后, 转码
          await aliyunTransCode({
            lessonId: this.lessonInfo.lessonId,
            coverImageUrl: this.imageUrl,
            fileName: this.video.files[0].name,
            fileId: this.videoId
          })

          // 获取转码的进度
          let timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(
              this.lessonInfo.lessonId
            )

            if (data.data === 100) {
              window.clearInterval(timer)
              timer = null

              this.isTransCodeSuccess = true
              this.$message.success('转码成功!')
            }
          }, 2000)
        }
      })
    },
    // 开始上传
    startUploadFn () {
      // 处理初始值
      this.isUpload = false
      this.isUploadSuccess = false
      this.isTransCodeSuccess = false
      this.uploadPercent = 0

      const videoFile = this.video.files[0]
      const imageFile = this.image.files[0]
      const uploader = this.uploader

      // 将文件添加到上传列表
      uploader.addFile(imageFile, null, null, null, '{"Vod":{}}')
      uploader.addFile(videoFile, null, null, null, '{"Vod":{}}')

      // 开始上传, 触发 onUploadstarted 事件
      uploader.startUpload()
    }
  }
})
</script>

<style lang="scss" scoped>
.handleVideoBox {
  text-align: right;
}
</style>
