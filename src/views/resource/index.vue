<template>
  <source-list-comp></source-list-comp>
</template>

<script lang="ts">
import Vue from 'vue'

import SourceListComp from './components/resourceList.vue'

export default Vue.extend({
  name: 'ResourceIndex',
  components: {
    SourceListComp
  }
})
</script>

<style lang="scss" scoped></style>
