import { createChart, createSection, createChordGrid, createGridRow, createLyricBlock, createCueNote, createDivider } from '@/models/chart.js'

const SECTION_RE = /^\[(.+?)\]\s*(?:x(\d+))?$/
const META_RE = /^(Song|Key|Tempo|BPM):\s*(.+)/
const GRID_RE = /^\|.*\|/
const DIVIDER_RE = /^─+|--+$/

function detectBeatCount(line) {
  const cells = line.match(/[^|]+/g)
  if (!cells) return 4
  return cells.length
}

function parseGridLine(line, beatCount) {
  const cells = line.match(/[^|]+/g)
  if (!cells) return null
  return Array.from({ length: beatCount }, (_, i) => ({
    chord: (cells[i] || '').trim(),
  }))
}

export function importPlainText(text) {
  const rawLines = text.split('\n')
  const chart = createChart()

  let currentSection = chart.sections[0]
  let i = 0

  // Parse metadata
  while (i < rawLines.length) {
    const m = rawLines[i].match(META_RE)
    if (!m) break
    const key = m[1].toLowerCase()
    const val = m[2].trim()
    if (key === 'song') chart.songName = val
    else if (key === 'key') chart.key = val
    else if (key === 'tempo' || key === 'bpm') chart.tempo = parseInt(val) || null
    i++
  }

  // Skip blank lines after metadata
  while (i < rawLines.length && rawLines[i].trim() === '') i++

  // Parse sections
  while (i < rawLines.length) {
    const line = rawLines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    const secMatch = line.match(SECTION_RE)
    if (secMatch) {
      const label = secMatch[1].trim()
      const repeat = secMatch[2] ? parseInt(secMatch[2]) : null

      // Detect section type from label
      const lower = label.toLowerCase()
      let type = 'verse'
      if (lower.startsWith('intro')) type = 'intro'
      else if (lower.startsWith('verse') || lower.startsWith('v')) type = 'verse'
      else if (lower.startsWith('chorus') || lower.startsWith('c')) type = 'chorus'
      else if (lower.startsWith('solo') || lower.startsWith('s')) type = 'solo'
      else if (lower.startsWith('ending') || lower.startsWith('outro') || lower.startsWith('e')) type = 'ending'

      currentSection = createSection(type)
      if (label !== type.charAt(0).toUpperCase() + type.slice(1)) {
        currentSection.label = label
      }
      currentSection.repeatCount = repeat
      chart.sections.push(currentSection)
      i++
      continue
    }

    if (line.trim().match(DIVIDER_RE)) {
      currentSection.blocks.push(createDivider())
      i++
      continue
    }

    if (line.trim().match(GRID_RE)) {
      // Collect consecutive grid lines
      const beatCount = detectBeatCount(line.trim())
      const grid = createChordGrid(beatCount)
      grid.beatCount = beatCount
      grid.rows = []

      while (i < rawLines.length && rawLines[i].trim().match(GRID_RE)) {
        const beats = parseGridLine(rawLines[i].trim(), beatCount)
        if (beats) {
          grid.rows.push(createGridRow(beatCount))
          Object.assign(grid.rows[grid.rows.length - 1], { beats })
        }
        i++
      }

      if (grid.rows.length === 0) {
        grid.rows.push(createGridRow(beatCount))
      }

      currentSection.blocks.push(grid)
      continue
    }

    // Check if this is a chord+lyric pair (chord line followed by lyric line)
    if (i + 1 < rawLines.length) {
      const nextLine = rawLines[i + 1]
      const currentLine = line
      // A chord line has chord names with spaces between them
      if (currentLine.trim() !== '' && nextLine.trim() !== '' && !currentLine.trim().match(SECTION_RE) && !currentLine.trim().match(GRID_RE)) {
        const chordNames = currentLine.trim().match(/[A-G][#b]?(?:m|maj|min|dim|aug|sus|add|7|9|11|13|6|2|4|5)*(?:\/[A-G][#b]?)?/g)
        if (chordNames && chordNames.length >= 1) {
          // This looks like a chord line above lyrics
          const lyricText = nextLine.trim()
          const lyricBlock = createLyricBlock()
          lyricBlock.lines.push({
            id: crypto.randomUUID(),
            spans: [{ id: crypto.randomUUID(), chord: '', text: lyricText }],
          })
          currentSection.blocks.push(lyricBlock)
          i += 2
          continue
        }
      }
    }

    // Default: treat as cue note or plain text
    currentSection.blocks.push(createCueNote(line.trim()))
    i++
  }

  // Remove the initial empty intro section if we parsed real sections
  if (chart.sections.length > 1 && chart.sections[0].blocks.length === 0) {
    chart.sections.shift()
  }

  return chart
}
