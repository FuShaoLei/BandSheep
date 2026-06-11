<script setup>
import { computed } from 'vue'
import { exportToPlainText } from '@/composables/usePlainTextExport.js'

const props = defineProps({
  chart: { type: Object, required: true },
})

const previewText = computed(() => exportToPlainText(props.chart))
</script>

<template>
  <div class="preview-pane">
    <h3 class="pane-title">预览</h3>
    <pre class="preview-text">{{ previewText }}</pre>
  </div>
</template>

<style scoped>
.preview-pane {
  height: 100%;
}

.pane-title {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color);
  font-weight: 600;
}

.preview-text {
  font-family: var(--font-mono);
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--el-text-color-primary);
}
</style>
