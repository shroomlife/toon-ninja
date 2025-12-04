# TOON Viewer

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

A powerful Nuxt 3 SPA for viewing and editing TOON data (JSON) with a modern, feature-rich interface.

## Features

- 🌲 **Tree-view Explorer** - Navigate complex JSON structures with collapsible tree view
- ✏️ **Monaco Editor** - Professional code editor with syntax highlighting and validation
- 👁️ **Live Preview** - Real-time preview of your JSON data
- 🔍 **Search & Filter** - Find keys and values quickly
- ↩️ **Undo/Redo** - Full history support with keyboard shortcuts
- 🌓 **Dark/Light Mode** - System-aware theme switching
- 📦 **Import/Export** - Drag-drop file upload and download
- 🔄 **Batch Editing** - Find & replace with regex support
- 📊 **Diff View** - Compare two JSON versions side-by-side
- ⌨️ **Keyboard Shortcuts** - Power user friendly
- 🌍 **i18n Support** - English and German translations
- 📱 **Responsive** - Works on desktop and mobile

## Tech Stack

- [Nuxt 4](https://nuxt.com) - Vue.js Framework
- [Nuxt UI](https://ui.nuxt.com) - UI Component Library
- [Pinia](https://pinia.vuejs.org) - State Management
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code Editor
- [@nuxtjs/i18n](https://i18n.nuxtjs.org) - Internationalization
- [VueUse](https://vueuse.org) - Composition Utilities

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + Shift + F` | Format JSON |
| `Ctrl + F` | Search |
| `G then H` | Go to Home/Viewer |
| `G then C` | Go to Compare |
| `?` | Toggle Shortcuts |

## License

MIT
