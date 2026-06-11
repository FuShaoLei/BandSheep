<script setup>
import { useChart } from '@/composables/useChart.js'
import { exportToPlainText, downloadTxt } from '@/composables/usePlainTextExport.js'
import { importPlainText } from '@/composables/usePlainTextImport.js'
import { Download, Upload, Plus } from '@element-plus/icons-vue'

const { chart, resetChart } = useChart()

function handleExport() {
  const text = exportToPlainText(chart)
  const name = chart.songName || 'chart'
  downloadTxt(text, name + '.txt')
}

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.txt'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const imported = importPlainText(reader.result)
      Object.assign(chart, imported)
    }
    reader.readAsText(file)
  }
  input.click()
}
</script>

<template>
  <div class="toolbar">
    <span class="app-title">BandSheep</span>
    <div class="toolbar-actions">
      <el-button :icon="Upload" @click="handleImport">导入</el-button>
      <el-button type="primary" :icon="Download" @click="handleExport">导出 .txt</el-button>
      <el-button :icon="Plus" @click="resetChart" type="danger" plain>新建</el-button>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  flex-shrink: 0;
}

.app-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--el-color-primary);
  letter-spacing: 0.5px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}
</style>
