<template>
  <create-menu-comp />
</template>

<script lang="ts">
import Vue from 'vue'
import CreateMenuComp from './components/CreateOrEditMenu.vue'

export default Vue.extend({
  name: 'MenuCreate',
  components: {
    CreateMenuComp
  }
})
</script>
