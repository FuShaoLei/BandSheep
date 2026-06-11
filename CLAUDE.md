# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BandSheep (乐队谱子制作感觉) — a Vue 3 + Vite 7 SPA for creating band lead sheets/charts. Features a visual editor for chord grids and lyric+chord annotation, with plain text export. Deployed to GitHub Pages at `/BandSheep/`.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally

No test runner or linter is currently configured.

## Architecture

- **Framework:** Vue 3 with `<script setup>` Composition API, ES Modules
- **UI Library:** Element Plus (dark mode, globally registered in `main.js`)
- **Icons:** `@element-plus/icons-vue`
- **Build:** Vite 7 with `@vitejs/plugin-vue` and `vue-devtools` plugin
- **Entry:** `index.html` (with `class="dark"`) → `src/main.js` → `src/App.vue`
- **Path alias:** `@/*` maps to `./src/*`
- **State:** Single `reactive()` chart object in `composables/useChart.js` (singleton, no Pinia needed). Auto-saves to localStorage with 500ms debounce.
- **Layout:** Left panel = editor (el-scrollbar), Right panel = `<pre>` plain text preview

### Data Model (`src/models/chart.js`)

```
Chart { songName, key, tempo, sections[] }
  Section { id, type, label, repeatCount, blocks[] }
    Block kinds: chordGrid, lyricBlock, cueNote, divider
      chordGrid { beatCount, rows[] { beats[] { chord } } }
      lyricBlock { lines[] { spans[] { chord, text } } }
      cueNote { text }
      divider {}
```

### Key Composables

- `useChart.js` — singleton reactive chart state + localStorage persistence
- `usePlainTextExport.js` — chart model → formatted plain text string + .txt download
- `usePlainTextImport.js` — plain text file → chart model (regex-based parser)

### UI Language

All user-facing labels are in Chinese (中文).

## Environment

- `.env` contains `VITE_APP_TITLE` and `VITE_PUBLISH_PATH` (used as Vite's `base` for GitHub Pages)
- GitHub Actions workflow template at `.github/workflows/fuck.yml.example` — rename to `.yml` to activate

## Node Version

Requires Node.js `^20.19.0 || >=22.12.0`.
