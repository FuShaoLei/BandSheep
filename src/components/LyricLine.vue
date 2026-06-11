<script setup>
import { nextTick } from 'vue'

const props = defineProps({
  spans: { type: Array, required: true },
})

const emit = defineEmits(['update'])

function getCharOffset(e) {
  const sel = window.getSelection()
  if (!sel.rangeCount) return -1
  const range = sel.getRangeAt(0)
  const pre = range.cloneRange()
  pre.selectNodeContents(e.currentTarget)
  pre.setEnd(range.startContainer, range.startOffset)
  return pre.toString().length
}

function handleClick(e) {
  const totalLen = props.spans.reduce((sum, s) => sum + s.text.length, 0)
  const offset = getCharOffset(e)
  if (offset < 0 || offset >= totalLen) return

  let cum = 0
  for (let i = 0; i < props.spans.length; i++) {
    const s = props.spans[i]
    if (cum + s.text.length > offset) {
      const local = offset - cum
      if (s.chord) {
        nextTick(() => {
          const inputs = e.currentTarget.querySelectorAll('.lyric-chord-input')
          if (inputs[i]) inputs[i].focus()
        })
        return
      }
      if (local === 0 && i === 0) {
        s.chord = 'G'
        nextTick(() => {
          const inputs = e.currentTarget.querySelectorAll('.lyric-chord-input')
          if (inputs[0]) inputs[0].select()
        })
      } else if (local > 0) {
        const t1 = s.text.substring(0, local)
        const t2 = s.text.substring(local)
        s.text = t1
        const newSpan = { id: crypto.randomUUID(), chord: 'G', text: t2 }
        props.spans.splice(i + 1, 0, newSpan)
        nextTick(() => {
          const inputs = e.currentTarget.querySelectorAll('.lyric-chord-input')
          if (inputs[i + 1]) inputs[i + 1].select()
        })
      }
      emit('update')
      return
    }
    cum += s.text.length
  }
}

function onChordKeydown(e, index) {
  if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    e.target.blur()
    emit('update')
  }
  if (e.key === 'Backspace' && e.target.value === '') {
    e.preventDefault()
    props.spans[index].chord = ''
    emit('update')
  }
}
</script>

<template>
  <div class="lyric-line" @click="handleClick">
    <span v-for="(span, i) in spans" :key="span.id" class="lyric-span-group">
      <input
        v-if="span.chord"
        :value="span.chord"
        class="lyric-chord-input"
        @input="span.chord = $event.target.value; emit('update')"
        @keydown="onChordKeydown($event, i)"
        @click.stop
      />
      <span class="lyric-text-span">{{ span.text }}</span>
    </span>
  </div>
</template>

<style scoped>
.lyric-line {
  cursor: text;
  padding: 4px 0;
  min-height: 28px;
  font-family: var(--font-mono);
  font-size: 16px;
  line-height: 1.6;
}

.lyric-span-group {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  vertical-align: bottom;
}

.lyric-chord-input {
  width: 48px;
  height: 22px;
  padding: 0 3px;
  font-size: 14px;
  font-family: var(--font-mono);
  font-weight: 600;
  text-align: center;
  border: 1px solid var(--el-color-primary);
  background: var(--el-fill-color);
  color: var(--el-color-primary);
  line-height: 20px;
  outline: none;
}

.lyric-chord-input:focus {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.lyric-text-span {
  white-space: pre;
}
</style>
