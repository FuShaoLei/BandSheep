<script setup>
import { useChart } from './composables/useChart.js'
import MetadataEditor from './components/MetadataEditor.vue'
import SectionList from './components/SectionList.vue'
import PreviewPane from './components/PreviewPane.vue'
import Toolbar from './components/Toolbar.vue'

const { chart } = useChart()
</script>

<template>
  <div class="app">
    <Toolbar :chart="chart" />
    <div class="main-layout">
      <div class="panel editor-panel">
        <div class="editor-content">
          <MetadataEditor :chart="chart" />
          <SectionList :chart="chart" />
        </div>
      </div>
      <div class="panel-divider" />
      <div class="panel preview-panel">
        <PreviewPane :chart="chart" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.panel {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}

.editor-content {
  padding: 20px;
}

.panel-divider {
  width: 1px;
  background: var(--el-border-color);
  flex-shrink: 0;
}

.preview-panel {
  padding: 20px;
}
</style>
