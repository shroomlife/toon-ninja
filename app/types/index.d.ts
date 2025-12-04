/**
 * TOON Viewer Type Definitions
 * Reference: https://toonformat.dev/reference/spec
 */

// === TOON File Format Types ===
export interface ToonNode {
  id: string
  key: string
  value: unknown
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  children?: ToonNode[]
  path: string[]
  expanded?: boolean
}

export interface ToonFile {
  content: string
  name: string
  path: string
  size: number
  lastModified: number
  format: 'toon' | 'unknown'
  parsed?: ToonNode
  isValid: boolean
  errors?: ValidationError[]
}

export interface ValidationError {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning' | 'info'
}

// === Editor Configuration ===
export interface EditorSettings {
  fontSize: number
  wordWrap: 'on' | 'off' | 'wordWrapColumn'
  autoSave: boolean
  autoSaveInterval: number
  showLineNumbers: boolean
  showMinimap: boolean
  tabSize: number
  theme: 'light' | 'dark'
  fontFamily: string
  renderWhitespace: 'none' | 'selection' | 'all'
}

// === History & Undo/Redo ===
export interface HistoryState {
  content: string
  timestamp: number
  version: number
}

export interface UndoRedoStack {
  undo: HistoryState[]
  redo: HistoryState[]
  current: HistoryState
}

// === Batch Operations ===
export interface BatchEditOperation {
  id: string
  type: 'replace' | 'update' | 'delete' | 'insert'
  path: string[]
  oldValue?: unknown
  newValue?: unknown
  timestamp: number
}

export interface BatchEditSession {
  id: string
  operations: BatchEditOperation[]
  createdAt: number
  appliedAt?: number
}

// === Diff Comparison ===
export interface DiffChange {
  type: 'add' | 'remove' | 'change'
  line: number
  oldValue?: string
  newValue?: string
  context?: string
}

export interface DiffResult {
  original: string
  modified: string
  changes: DiffChange[]
  similarity: number
}

// === Import/Export ===
export interface ExportOptions {
  format: 'toon' | 'json'
  minify?: boolean
  includeMetadata?: boolean
}

export interface ImportResult {
  success: boolean
  file?: ToonFile
  errors?: ValidationError[]
}

// === Application State ===
export interface ApplicationState {
  currentFile?: ToonFile
  isModified: boolean
  isDarkMode: boolean
  language: 'en' | 'de'
}

// === UI Components Props ===
export interface TreeNodeProps {
  node: ToonNode
  level: number
  isSelected: boolean
  isExpanded: boolean
}

export interface EditorProps {
  value: string
  language: string
  theme: string
  readOnly?: boolean
  options?: Record<string, unknown>
}
