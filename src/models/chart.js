import { reactive } from 'vue'

export function createChart() {
  return reactive({
    songName: '',
    key: '',
    tempo: null,
    sections: [createSection('intro')],
  })
}

export function createSection(type = 'verse') {
  return reactive({
    id: crypto.randomUUID(),
    type,
    label: '',
    repeatCount: null,
    blocks: [],
  })
}

export function createChordGrid(beatCount = 4) {
  return reactive({
    id: crypto.randomUUID(),
    kind: 'chordGrid',
    beatCount,
    rows: [createGridRow(beatCount)],
  })
}

export function createGridRow(beatCount = 4) {
  return reactive({
    id: crypto.randomUUID(),
    beats: Array.from({ length: beatCount }, () => ({ chord: '' })),
  })
}

export function createLyricBlock() {
  return reactive({
    id: crypto.randomUUID(),
    kind: 'lyricBlock',
    lines: [],
  })
}

export function createLyricLine(text = '') {
  return reactive({
    id: crypto.randomUUID(),
    spans: text ? [{ id: crypto.randomUUID(), chord: '', text }] : [],
  })
}

export function createCueNote(text = '') {
  return reactive({
    id: crypto.randomUUID(),
    kind: 'cueNote',
    text,
  })
}

export function createDivider() {
  return reactive({
    id: crypto.randomUUID(),
    kind: 'divider',
  })
}
