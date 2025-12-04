# TOON Ninja

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

A modern Nuxt 4 SPA for viewing and editing [TOON](https://toonformat.dev) data with Monaco editor, live preview, and diff comparison.

## Features

- 🌲 **Tree-view Explorer** - Navigate complex TOON structures with collapsible tree view
- ✏️ **Monaco Editor** - Professional code editor with syntax highlighting and validation
- 👁️ **Live Preview** - Real-time preview of your TOON data
- 🔍 **Search & Filter** - Find keys and values quickly
- ↩️ **Undo/Redo** - Full history support with keyboard shortcuts
- 🌓 **Dark/Light Mode** - System-aware theme switching
- 📦 **Import/Export** - Drag-drop file upload and download
- 🔄 **Batch Editing** - Find & replace with regex support
- 📊 **Diff View** - Compare two TOON versions side-by-side
- 🔀 **Convert** - Convert between TOON and JSON formats
- ⚡ **Token Optimization** - Analyze and optimize token usage
- ⌨️ **Keyboard Shortcuts** - Power user friendly
- 🌍 **i18n Support** - 12 languages (EN, DE, ES, FR, HI, JA, KO, PL, PT, RU, VI, ZH)
- 📱 **Responsive** - Works on desktop and mobile

## Tech Stack

- [Nuxt 4](https://nuxt.com) - Vue.js Framework
- [Nuxt UI 4](https://ui.nuxt.com) - UI Component Library
- [Pinia](https://pinia.vuejs.org) - State Management
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code Editor
- [@toon-format/toon](https://toonformat.dev) - TOON Parser
- [@nuxtjs/i18n](https://i18n.nuxtjs.org) - Internationalization
- [VueUse](https://vueuse.org) - Composition Utilities
- [Zod](https://zod.dev) - Schema Validation
- [diff](https://github.com/kpdecker/jsdiff) - Diff Library

## Setup

Make sure to install the dependencies:

```bash
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun dev
```

## Production

Build the application for production:

```bash
bun run build
```

Locally preview production build:

```bash
bun run preview
```

## Docker

Build and run with Docker:

```bash
docker build -t toon-ninja:latest .
docker run -p 3000:3000 toon-ninja:latest
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + Shift + F` | Format |
| `Ctrl + F` | Search |
| `Ctrl + O` | Import |
| `Ctrl + Shift + S` | Export |

## Pages

- `/` - TOON Viewer & Editor
- `/compare` - Diff Comparison View
- `/convert` - TOON/JSON Converter
- `/features` - Feature Overview
- `/token-optimization` - Token Analyzer
- `/about` - About Page

## License

MIT
