<script setup>
const props = defineProps({
  block: { type: Object, required: true },
})
</script>

<template>
  <div class="cue-note">
    <el-input v-model="block.text" placeholder="提示信息，如: Vox In @ 8.3" style="font-family: var(--font-mono);" />
  </div>
</template>

<style scoped>
.cue-note {
  padding: 2px 0;
}
</style>
