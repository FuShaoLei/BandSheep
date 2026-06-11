<script setup>
import { ref, nextTick } from 'vue'
import { createGridRow } from '@/models/chart.js'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  block: { type: Object, required: true },
})

function addRow() {
  const newRow = createGridRow(props.block.beatCount)
  props.block.rows.push(newRow)
}

function removeRow(index) {
  if (props.block.rows.length <= 1) return
  props.block.rows.splice(index, 1)
}

function focusBeat(rowIndex, beatIndex) {
  const rowEl = rowRefs.value[rowIndex]
  if (!rowEl) return
  const inputs = rowEl.querySelectorAll('.beat-input')
  if (inputs[beatIndex]) inputs[beatIndex].focus()
}

const rowRefs = ref([])

function setRowRef(el) {
  if (el) rowRefs.value.push(el)
}

function onBeatKeyDown(e, rowIndex, beatIndex) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addRow()
    nextTick(() => focusBeat(rowIndex + 1, beatIndex))
  }
}
</script>

<template>
  <div class="chord-grid-editor">
    <div class="grid-controls">
      <span class="beat-label">每小节拍数</span>
      <el-select v-model.number="block.beatCount" size="small" style="width: 70px;">
        <el-option v-for="n in [3,4,6,8]" :key="n" :value="n" :label="n + ' 拍'" />
      </el-select>
      <el-button :icon="Plus" size="small" @click="addRow">添加小节</el-button>
    </div>
    <div
      v-for="(row, ri) in block.rows"
      :key="row.id"
      :ref="setRowRef"
      class="grid-row"
    >
      <el-button
        class="row-remove"
        size="small"
        circle
        type="danger"
        plain
        @click="removeRow(ri)"
      >
        <el-icon><Close /></el-icon>
      </el-button>
      <span class="bar-line">|</span>
      <input
        v-for="(beat, bi) in row.beats"
        :key="bi"
        v-model="beat.chord"
        class="beat-input"
        @keydown="onBeatKeyDown($event, ri, bi)"
      />
      <span class="bar-line">|</span>
    </div>
  </div>
</template>

<script>
import { Close } from '@element-plus/icons-vue'
export default { components: { Close } }
</script>

<style scoped>
.chord-grid-editor {
  padding: 4px 0;
}

.grid-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.beat-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.grid-row {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 2px;
}

.bar-line {
  color: var(--el-text-color-secondary);
  font-family: var(--font-mono);
  font-size: 16px;
  user-select: none;
  padding: 0 2px;
  font-weight: bold;
}

.beat-input {
  width: 64px;
  height: 32px;
  text-align: center;
  padding: 0 4px;
  font-family: var(--font-mono);
  font-size: 15px;
  border: 1px solid var(--el-border-color);
  border-left: none;
  border-radius: 0;
  background: var(--el-fill-color);
  color: var(--el-text-color-primary);
  outline: none;
  transition: border-color 0.2s;
}

.beat-input:first-of-type {
  border-left: 1px solid var(--el-border-color);
  border-radius: 4px 0 0 4px;
}

.beat-input:last-of-type {
  border-radius: 0 4px 4px 0;
}

.beat-input:focus {
  border-color: var(--el-color-primary);
  z-index: 1;
}

.row-remove {
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 1;
}

.grid-row:hover .row-remove {
  opacity: 1;
}
</style>
