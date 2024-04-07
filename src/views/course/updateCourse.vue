<template>
  <div class="createCourseBox">
    <handler-course
      :isEdit="isEdit"
      :courseId="courseId"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import HandlerCourse from './components/createOrUpdateCourse.vue'

export default Vue.extend({
  name: 'UpdateCourse',
  components: {
    HandlerCourse
  },
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      isEdit: true
    }
  }
})
</script>

<style lang="scss" scoped>
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
