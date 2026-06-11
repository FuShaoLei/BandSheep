<script setup>
import { ref } from 'vue'
import LyricLine from './LyricLine.vue'

const props = defineProps({
  block: { type: Object, required: true },
})

const mode = ref(props.block.lines.length ? 'annotate' : 'edit')
const rawText = ref('')

function switchToAnnotate() {
  const lines = rawText.value.split('\n')
  props.block.lines = lines.map(text => ({
    id: crypto.randomUUID(),
    spans: text ? [{ id: crypto.randomUUID(), chord: '', text }] : [],
  }))
  mode.value = 'annotate'
}

function switchToEdit() {
  rawText.value = props.block.lines
    .map(line => line.spans.map(s => s.text).join(''))
    .join('\n')
  mode.value = 'edit'
}

function onUpdate() {
  props.block.lines = [...props.block.lines]
}
</script>

<template>
  <div class="lyric-editor">
    <div v-if="mode === 'edit'" class="edit-mode">
      <el-input
        v-model="rawText"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 10 }"
        placeholder="在此输入或粘贴歌词，每行一句..."
        class="lyric-textarea"
      />
      <div class="edit-actions">
        <el-button type="primary" size="small" @click="switchToAnnotate">
          开始标注和弦
        </el-button>
      </div>
    </div>
    <div v-else class="annotate-mode">
      <el-button class="edit-btn" size="small" text @click="switchToEdit">
        编辑歌词
      </el-button>
      <div class="lyric-lines">
        <LyricLine
          v-for="(line, i) in block.lines"
          :key="line.id"
          :spans="line.spans"
          @update="onUpdate"
        />
      </div>
      <div v-if="!block.lines.length" class="empty-hint">
        点击"编辑歌词"输入内容
      </div>
    </div>
  </div>
</template>

<style scoped>
.lyric-editor {
  padding: 4px 0;
}

.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-actions {
  text-align: right;
}

.annotate-mode {
  position: relative;
}

.edit-btn {
  position: absolute;
  top: -8px;
  right: 0;
  font-size: 12px;
}

.lyric-lines {
  margin-top: 8px;
}

.empty-hint {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
</style>
