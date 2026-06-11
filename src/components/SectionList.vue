<script setup>
import { SECTION_TYPES } from '@/models/types.js'
import { useChart } from '@/composables/useChart.js'
import { Plus } from '@element-plus/icons-vue'
import SectionHeader from './SectionHeader.vue'
import BlockList from './BlockList.vue'

const { chart, addSection, removeSection, moveSection } = useChart()
</script>

<template>
  <div class="section-list">
    <div
      v-for="(section, index) in chart.sections"
      :key="section.id"
      class="section-card"
    >
      <SectionHeader
        :section="section"
        :index="index"
        :total="chart.sections.length"
        @remove="removeSection(index)"
        @move-up="moveSection(index, -1)"
        @move-down="moveSection(index, 1)"
      />
      <BlockList :section="section" />
    </div>
    <div class="add-section">
      <el-button
        v-for="t in SECTION_TYPES"
        :key="t.value"
        :icon="Plus"
        @click="addSection(t.value)"
        round
      >
        {{ t.label }}
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.section-card {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-bg-color);
}

.add-section {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}
</style>
