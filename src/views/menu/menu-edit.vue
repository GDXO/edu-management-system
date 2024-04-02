<template>
  <create-menu-comp :isEdit="true" />
</template>

<script lang="ts">
import Vue from 'vue'
import CreateMenuComp from './components/CreateOrEditMenu.vue'

export default Vue.extend({
  name: 'MenuEdit',
  components: {
    CreateMenuComp
  }
})
</script>
