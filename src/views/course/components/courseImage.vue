<template>
  <div class="courseUploadBox">
    <el-progress
      type="circle"
      :width="178"
      :percentage="percentage"
      v-if="isUploading"
      :status="percentage === 100 ? 'success' : undefined"
    />
    <el-upload
      v-else
      action=""
      :show-file-list="false"
      :before-upload="beforeCourseCoverUpload"
      :http-request="uploadCourseCoverFn"
    >
      <img v-if="value" :src="value" class="coverImg" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { uploadCourseImg } from '@/API/course'

export default Vue.extend({
  name: 'CourseImage',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      isUploading: false,
      percentage: 0
    }
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeCourseCoverUpload (file: any) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 上传课程封面
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async uploadCourseCoverFn (options: any) {
      // 显示进度条
      this.isUploading = true

      const fd = new FormData()
      fd.append('file', options.file)

      // 上传图片
      const { data } = await uploadCourseImg(fd, evt => {
        if (evt.total) {
          this.percentage = Math.floor((evt.loaded * 100) / evt.total)
        }
      })
      if (data.code === '000000') {
        // 关闭进度条
        this.isUploading = false
        this.percentage = 0

        // 成功提示
        this.$message.success('上传成功!')
        this.$emit('input', data.data.name)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

::v-deep .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.coverImg {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
