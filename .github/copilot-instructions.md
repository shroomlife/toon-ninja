# TOON Viewer - GitHub Copilot Custom Instructions

You are an expert assistant for the **TOON Viewer** project - a modern Nuxt 4 SPA for viewing and editing TOON data files. This is NOT a JSON editor. Focus on TOON format compliance per [toonformat.dev/reference/spec](https://toonformat.dev/reference/spec).

## Project Overview

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **UI Library**: Nuxt UI 4 with Tailwind CSS
- **State Management**: Pinia
- **Editor**: Monaco Editor (lazy-loaded)
- **Diff Library**: diff library for version comparison
- **i18n**: @nuxtjs/i18n with EN/DE locales
- **Package Manager**: bun (not npm or pnpm)
- **License**: MIT - Open Source

## Code Style & Conventions

### JavaScript/TypeScript
- **Syntax**: Use `<script setup>` in Vue components
- **Imports**: ES modules only, avoid CommonJS
- **Async**: Prefer async/await over .then()
- **Null Handling**: Use optional chaining (?.) and nullish coalescing (??)
- **Types**: Always use TypeScript with strict mode

### Naming Conventions
- Variables & functions: `camelCase`
- Constants: `CONSTANT_CASE`
- Types & interfaces: `PascalCase`
- Components: `PascalCase.vue`
- Directories: `kebab-case`
- Pages: `kebab-case.vue`

### File Organization
```
app/
├── components/       # PascalCase, grouped by feature (e.g., toon/)
├── composables/      # useFeatureName.ts pattern
├── pages/            # kebab-case.vue, file-based routing
├── stores/           # featureName.ts, Pinia Setup Stores
├── types/            # TypeScript interfaces & types
├── utils/            # Shared utilities (named exports from index.ts)
├── layouts/          # default.vue for main layout
└── assets/           # CSS and static assets
```

## TOON Format Guidelines

**CRITICAL**: This app is about TOON files, NOT JSON!

- **Reference Spec**: https://toonformat.dev/reference/spec
- **Parser Focus**: Implement TOON-specific parsing and validation
- **Editor Syntax**: Configure Monaco with TOON syntax highlighting
- **Validation**: Use Zod for TOON schema validation
- **Preview**: Display TOON data in proper tree structure
- **File Extension**: .toon (not .json)
- **Error Handling**: Provide clear TOON parsing error messages with line/column info

## Component Development

### Best Practices
- One responsibility per component
- Extract complex logic into composables
- Use TypeScript for prop validation
- Implement proper error boundaries
- Add semantic HTML and ARIA labels

### Component Example Structure
```typescript
<script setup lang="ts">
import type { ToonNode } from '~/types'

interface Props {
  node: ToonNode
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
})

const emit = defineEmits<{
  select: [node: ToonNode]
}>()
</script>

<template>
  <!-- Template here -->
</template>
```

## State Management with Pinia

- Create Setup Stores (not Options API stores)
- Keep stores focused and single-responsibility
- Use computed/ref for state
- Define actions as functions
- Document public API for each store

Example:
```typescript
export const useToonStore = defineStore('toon', () => {
  const files = ref<ToonFile[]>([])
  const current = computed(() => files.value[0])
  
  const setFile = (file: ToonFile) => { /* ... */ }
  
  return { files, current, setFile }
})
```

## Composables

- Prefix with `use` (e.g., `useDashboard`, `useEditor`)
- Export as default or named exports
- Use TypeScript for parameter/return types
- Handle cleanup properly (onUnmounted)

Example:
```typescript
export const useMonacoEditor = () => {
  const editor = ref<editor.IStandaloneCodeEditor | null>(null)
  
  const create = (container: HTMLElement) => { /* ... */ }
  const getValue = () => editor.value?.getValue() ?? ''
  
  onUnmounted(() => {
    editor.value?.dispose()
  })
  
  return { editor, create, getValue }
}
```

## Editor Integration

### Monaco Editor
- Lazy-load via dynamic import
- Configure TOON syntax highlighting
- Implement validation on change
- Add keyboard shortcuts (Ctrl+S for save, etc.)
- Support undo/redo from Pinia store
- Use `readOnly` prop for preview mode

### Keyboard Shortcuts
- **Ctrl+S** or **Cmd+S**: Save file
- **Ctrl+Z** or **Cmd+Z**: Undo
- **Ctrl+Y** or **Cmd+Y**: Redo
- **Ctrl+F** or **Cmd+F**: Find
- **Ctrl+H** or **Cmd+H**: Find & Replace

## Features Implementation

### Batch Editing
- Store operations in `BatchEditOperation[]`
- Group multiple edits in `BatchEditSession`
- Implement undo/redo for entire batch
- Preview changes before applying

### Diff View
- Use the `diff` library for comparison
- Display side-by-side view (original vs modified)
- Highlight added, removed, and changed lines
- Show line numbers and context

### Import/Export
- Support drag-and-drop for .toon files
- Validate on import using Zod
- Export with format option (toon/json)
- Provide clear error messages on failure

### Search & Filter
- Implement tree-based search by key names
- Filter by type (object, array, string, number, etc.)
- Highlight matches in editor
- Support regex patterns

## i18n Implementation

- Use `@nuxtjs/i18n` composable `useI18n()`
- Store locales in `i18n/locales/` (en.json, de.json)
- Language switcher in UserMenu component
- Respect user preference in localStorage
- Default to browser language if not set

## Performance Optimization

- **Code Splitting**: Monaco Editor as separate chunk
- **Lazy Loading**: Dynamic imports for heavy features
- **Tree Shaking**: Use named exports, avoid default exports where possible
- **Caching**: Cache parsed TOON AST in Pinia store
- **Debouncing**: Debounce editor changes and search input
- **Memoization**: Use computed properties for derived state

## Styling with Nuxt UI

- Use Nuxt UI components for consistency
- Apply Tailwind CSS for custom styling
- Support dark/light mode via `useColorMode()`
- Use semantic color tokens (gray, primary, success, etc.)
- Responsive design with mobile-first approach

## Testing & Quality

- Write unit tests for utilities and composables
- Write component tests for logic-heavy components
- Use TypeScript strict mode
- Run `bun run lint` before commits
- Run `bun run typecheck` to verify types
- Keep components simple and testable

## Git & Commits

- Use conventional commits (feat:, fix:, refactor:, etc.)
- Reference feature branches (e.g., `feature/editor-validation`)
- Include TOON format considerations in commit messages
- Keep commits focused and atomic

## Security Considerations

- Sanitize user input before rendering
- Validate TOON files with schema before parsing
- No eval() or dynamic code execution
- Use CSP headers in deployment
- Escape special characters in output

## Deployment

### Docker Build
```bash
docker build -t toon-viewer:latest .
docker run -p 3000:3000 toon-viewer:latest
```

- Multi-stage build with bun runtime
- Health check enabled
- Port 3000 exposed

### Build & Preview
```bash
bun run build    # Production build
bun run preview  # Preview production build
```

## When Asking for Code Changes

- Specify the component/file to modify
- Describe the change in terms of TOON functionality
- Provide context about user workflows
- Mention if it affects state management or multiple components
- Consider performance and accessibility impact

## Common Mistakes to Avoid

❌ Treating TOON like JSON
❌ Using require() instead of import
❌ Creating huge components without composables
❌ Storing too much state in components
❌ Not typing Props and Emits properly
❌ Ignoring error handling in async operations
❌ Hardcoding strings instead of i18n
❌ Not considering mobile responsiveness
❌ Missing ARIA labels for accessibility

## Resources

- [Nuxt 4 Documentation](https://nuxt.com)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Nuxt UI Components](https://ui.nuxt.com)
- [Pinia Documentation](https://pinia.vuejs.org)
- [TOON Format Specification](https://toonformat.dev/reference/spec)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/docs.html)

---

**Remember**: This is a TOON editor, not a JSON editor. Focus on TOON-specific features and compliance with the spec!
