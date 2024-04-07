<template>
  <div class="createCourseBox">
    <handler-course :isEdit="isEdit"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import HandlerCourse from './components/createOrUpdateCourse.vue'

export default Vue.extend({
  name: 'CreateCourse',
  components: {
    HandlerCourse
  },
  data () {
    return {
      isEdit: false
    }
  }
})
</script>

<style lang="scss" scoped></style>
