<script setup>
import { SECTION_TYPES } from '@/models/types.js'
import { createChordGrid, createLyricBlock, createCueNote, createDivider } from '@/models/chart.js'
import { Plus, Delete } from '@element-plus/icons-vue'
import ChordGridEditor from './ChordGridEditor.vue'
import LyricEditor from './LyricEditor.vue'
import CueNoteEditor from './CueNoteEditor.vue'
import DividerBlock from './DividerBlock.vue'

const props = defineProps({
  section: { type: Object, required: true },
})

function addBlock(kind) {
  const creators = {
    chordGrid: () => createChordGrid(),
    lyricBlock: () => createLyricBlock(),
    cueNote: () => createCueNote(),
    divider: () => createDivider(),
  }
  props.section.blocks.push(creators[kind]())
}

function removeBlock(index) {
  props.section.blocks.splice(index, 1)
}
</script>

<template>
  <div class="block-list">
    <div
      v-for="(block, i) in section.blocks"
      :key="block.id"
      class="block-item"
    >
      <el-button
        class="block-remove"
        :icon="Delete"
        size="small"
        circle
        type="danger"
        plain
        @click="removeBlock(i)"
      />
      <ChordGridEditor v-if="block.kind === 'chordGrid'" :block="block" />
      <LyricEditor v-else-if="block.kind === 'lyricBlock'" :block="block" />
      <CueNoteEditor v-else-if="block.kind === 'cueNote'" :block="block" />
      <DividerBlock v-else-if="block.kind === 'divider'" :block="block" />
    </div>
    <el-divider v-if="section.blocks.length" />
    <div class="add-blocks">
      <el-button size="small" :icon="Plus" @click="addBlock('chordGrid')">和弦网格</el-button>
      <el-button size="small" :icon="Plus" @click="addBlock('lyricBlock')">歌词</el-button>
      <el-button size="small" :icon="Plus" @click="addBlock('cueNote')">提示</el-button>
      <el-button size="small" :icon="Plus" @click="addBlock('divider')">分割线</el-button>
    </div>
  </div>
</template>

<style scoped>
.block-item {
  position: relative;
  margin-bottom: 8px;
  padding: 4px 0;
}

.block-remove {
  position: absolute;
  top: 4px;
  right: 0;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 1;
}

.block-item:hover .block-remove {
  opacity: 1;
}

.add-blocks {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
