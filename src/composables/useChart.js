import { reactive, watch, toRaw } from 'vue'
import { createChart, createSection } from '@/models/chart.js'

const STORAGE_KEY = 'bandsheep-chart'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return reactive(JSON.parse(raw))
  } catch { /* ignore */ }
  return createChart()
}

const chart = loadFromStorage()

let saveTimer = null
watch(() => JSON.stringify(toRaw(chart)), () => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toRaw(chart)))
  }, 500)
}, { deep: true })

function addSection(type = 'verse') {
  chart.sections.push(createSection(type))
}

function removeSection(index) {
  if (chart.sections.length <= 1) return
  chart.sections.splice(index, 1)
}

function moveSection(index, direction) {
  const target = index + direction
  if (target < 0 || target >= chart.sections.length) return
  const [item] = chart.sections.splice(index, 1)
  chart.sections.splice(target, 0, item)
}

function resetChart() {
  Object.assign(chart, createChart())
  localStorage.removeItem(STORAGE_KEY)
}

export function useChart() {
  return { chart, addSection, removeSection, moveSection, resetChart }
}
