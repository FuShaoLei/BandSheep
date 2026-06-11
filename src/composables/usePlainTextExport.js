import { SECTION_TYPES } from '@/models/types.js'
import { toRaw } from 'vue'

const typeLabels = Object.fromEntries(SECTION_TYPES.map(t => [t.value, t.label]))

function renderChordGridRow(beats, maxWidth = 4) {
  const cells = beats.map(b => b.chord.padEnd(maxWidth))
  return '| ' + cells.join(' | ') + ' |'
}

function renderLyricLine(spans) {
  let chordLine = ''
  let lyricLine = ''
  for (const span of spans) {
    const text = span.text
    const chord = span.chord
    if (chord) {
      const centerOffset = Math.floor(text.length / 2)
      const padLeft = Math.max(0, centerOffset - Math.floor(chord.length / 2))
      chordLine += ' '.repeat(padLeft) + chord
      const usedWidth = padLeft + chord.length
      if (usedWidth < text.length) {
        chordLine += ' '.repeat(text.length - usedWidth)
      }
    } else {
      chordLine += ' '.repeat(text.length)
    }
    lyricLine += text
  }
  const result = lyricLine.trimEnd() !== '' ? [chordLine, lyricLine] : []
  return result
}

export function exportToPlainText(chart) {
  const raw = toRaw(chart)
  const lines = []

  // Metadata
  if (raw.songName) lines.push('Song: ' + raw.songName)
  if (raw.key) lines.push('Key: ' + raw.key)
  if (raw.tempo) lines.push('Tempo: ' + raw.tempo)
  if (lines.length) lines.push('')

  // Sections
  for (const section of raw.sections) {
    const typeLabel = typeLabels[section.type] || section.type
    let header = '[' + typeLabel + ']'
    if (section.label) header = '[' + section.label + ']'
    if (section.repeatCount) header += ' x' + section.repeatCount

    lines.push(header)
    lines.push('')

    for (const block of section.blocks) {
      switch (block.kind) {
        case 'chordGrid':
          for (const row of block.rows) {
            lines.push(renderChordGridRow(row.beats))
          }
          lines.push('')
          break
        case 'lyricBlock':
          if (block.lines) {
            for (const line of block.lines) {
              if (line.spans && line.spans.length) {
                const result = renderLyricLine(line.spans)
                lines.push(...result)
              }
              lines.push('')
            }
          }
          break
        case 'cueNote':
          if (block.text) {
            lines.push(block.text)
            lines.push('')
          }
          break
        case 'divider':
          lines.push('─'.repeat(40))
          lines.push('')
          break
      }
    }
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

export function downloadTxt(text, filename) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
