<script setup>
import { nextTick } from 'vue'

const props = defineProps({
  beats: { type: Array, required: true },
  rowRef: { type: Object, required: true },
})

const emit = defineEmits(['add-row-below'])

function focusCell(index) {
  const el = props.rowRef.querySelectorAll('.beat-input')[index]
  if (el) el.focus()
}

function onKeyDown(e, index) {
  if (e.key === 'Enter') {
    e.preventDefault()
    emit('add-row-below')
    nextTick(() => focusCell(index))
  }
}
</script>

<template>
  <div class="chord-grid-row">
    <span class="bar-line">|</span>
    <input
      v-for="(beat, i) in beats"
      :key="i"
      :ref="el => { if (el) { if (!props.rowRef._inputs) props.rowRef._inputs = []; props.rowRef._inputs[i] = el } }"
      v-model="beat.chord"
      class="beat-input"
      @keydown="onKeyDown($event, i)"
    />
    <span class="bar-line">|</span>
  </div>
</template>

<style scoped>
.chord-grid-row {
  display: flex;
  align-items: center;
  gap: 0;
}

.bar-line {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 14px;
  user-select: none;
  padding: 0 2px;
}

.beat-input {
  width: 56px;
  text-align: center;
  padding: 4px 2px;
  font-family: var(--font-mono);
  font-size: 14px;
  border-radius: 0;
  border: 1px solid var(--border);
  border-left: none;
}

.beat-input:first-of-type {
  border-left: 1px solid var(--border);
}

.beat-input:focus {
  border-color: var(--accent);
  z-index: 1;
}
</style>
