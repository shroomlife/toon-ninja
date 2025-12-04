// TOON Viewer Types

export interface ToonNode {
  id: string
  key: string
  value: unknown
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  children?: ToonNode[]
  path: string[]
  expanded?: boolean
}

export interface HistoryState {
  content: string
  timestamp: number
}

export interface EditorSettings {
  fontSize: number
  wordWrap: boolean
  autoSave: boolean
  autoSaveInterval: number
  showLineNumbers: boolean
  showMinimap: boolean
  tabSize: number
}
