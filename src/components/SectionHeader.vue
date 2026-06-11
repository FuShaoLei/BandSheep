<script setup>
import { SECTION_TYPES } from '@/models/types.js'
import { ArrowUp, ArrowDown, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  section: { type: Object, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
})

const emit = defineEmits(['remove', 'move-up', 'move-down'])
</script>

<template>
  <div class="section-header">
    <div class="section-left">
      <el-select v-model="section.type" size="default" style="width: 110px;">
        <el-option v-for="t in SECTION_TYPES" :key="t.value" :value="t.value" :label="t.label" />
      </el-select>
      <el-input
        v-if="section.type === 'verse' || section.type === 'solo'"
        v-model="section.label"
        placeholder="标签"
        style="width: 90px;"
      />
      <el-input-number
        v-model="section.repeatCount"
        :min="0"
        :max="99"
        placeholder="次数"
        controls-position="right"
        size="default"
        style="width: 100px;"
      />
    </div>
    <div class="section-actions">
      <el-button :icon="ArrowUp" size="small" circle :disabled="index === 0" @click="$emit('move-up')" />
      <el-button :icon="ArrowDown" size="small" circle :disabled="index === total - 1" @click="$emit('move-down')" />
      <el-button :icon="Delete" size="small" circle type="danger" :disabled="total <= 1" @click="$emit('remove')" />
    </div>
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--el-fill-color);
  border-radius: 6px;
  margin-bottom: 8px;
}

.section-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-actions {
  display: flex;
  gap: 4px;
}
</style>
