import { defineStore } from 'pinia'

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

export const useToonStore = defineStore('toon', {
  state: () => ({
    rawContent: '' as string,
    parsedData: null as unknown,
    isValid: true,
    errorMessage: '',
    fileName: '',
    history: [] as HistoryState[],
    historyIndex: -1,
    maxHistory: 50,
    selectedNodePath: [] as string[],
    expandedPaths: new Set<string>(),
    searchQuery: '',
    searchResults: [] as string[],
    compareContent: '' as string,
    isDirty: false
  }),

  getters: {
    canUndo: (state): boolean => state.historyIndex > 0,
    canRedo: (state): boolean => state.historyIndex < state.history.length - 1,
    treeData: (state): ToonNode[] => {
      if (!state.parsedData) return []
      return buildTree(state.parsedData, [], state.expandedPaths)
    },
    formattedContent: (state): string => {
      return safeStringify(state.parsedData, state.rawContent, 2)
    },
    minifiedContent: (state): string => {
      return safeStringify(state.parsedData, state.rawContent)
    }
  },

  actions: {
    setContent(content: string, addToHistory = true) {
      this.rawContent = content
      this.isDirty = true
      this.validateAndParse()

      if (addToHistory && content !== this.history[this.historyIndex]?.content) {
        this.addToHistory(content)
      }
    },

    validateAndParse() {
      if (!this.rawContent.trim()) {
        this.parsedData = null
        this.isValid = true
        this.errorMessage = ''
        return
      }

      try {
        this.parsedData = JSON.parse(this.rawContent)
        this.isValid = true
        this.errorMessage = ''
      } catch (e) {
        this.isValid = false
        this.errorMessage = e instanceof Error ? e.message : 'Invalid JSON'
        this.parsedData = null
      }
    },

    addToHistory(content: string) {
      // Remove any future history if we're not at the end
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1)
      }

      this.history.push({
        content,
        timestamp: Date.now()
      })

      // Limit history size
      if (this.history.length > this.maxHistory) {
        this.history.shift()
      } else {
        this.historyIndex++
      }
    },

    undo() {
      if (this.canUndo) {
        this.historyIndex--
        const state = this.history[this.historyIndex]
        if (state) {
          this.rawContent = state.content
          this.validateAndParse()
        }
      }
    },

    redo() {
      if (this.canRedo) {
        this.historyIndex++
        const state = this.history[this.historyIndex]
        if (state) {
          this.rawContent = state.content
          this.validateAndParse()
        }
      }
    },

    format() {
      if (this.isValid && this.parsedData) {
        const formatted = JSON.stringify(this.parsedData, null, 2)
        this.setContent(formatted)
      }
    },

    minify() {
      if (this.isValid && this.parsedData) {
        const minified = JSON.stringify(this.parsedData)
        this.setContent(minified)
      }
    },

    clear() {
      this.setContent('')
      this.fileName = ''
      this.isDirty = false
    },

    setFileName(name: string) {
      this.fileName = name
    },

    toggleNode(path: string[]) {
      const pathStr = path.join('.')
      if (this.expandedPaths.has(pathStr)) {
        this.expandedPaths.delete(pathStr)
      } else {
        this.expandedPaths.add(pathStr)
      }
    },

    expandAll() {
      if (!this.parsedData) return
      const paths = collectAllPaths(this.parsedData, [])
      paths.forEach(p => this.expandedPaths.add(p))
    },

    collapseAll() {
      this.expandedPaths.clear()
    },

    selectNode(path: string[]) {
      this.selectedNodePath = path
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
      this.searchResults = query ? findMatches(this.parsedData, query, []) : []
    },

    setCompareContent(content: string) {
      this.compareContent = content
    },

    updateValue(path: string[], value: unknown) {
      if (!this.parsedData) return

      const newData = JSON.parse(JSON.stringify(this.parsedData))
      setNestedValue(newData, path, value)
      this.setContent(JSON.stringify(newData, null, 2))
    },

    deleteNode(path: string[]) {
      if (!this.parsedData || path.length === 0) return

      const newData = JSON.parse(JSON.stringify(this.parsedData))
      deleteNestedValue(newData, path)
      this.setContent(JSON.stringify(newData, null, 2))
    },

    batchReplace(find: string, replace: string, useRegex = false, matchCase = false) {
      if (!this.rawContent) return 0

      let flags = 'g'
      if (!matchCase) flags += 'i'

      let regex: RegExp
      try {
        regex = useRegex ? new RegExp(find, flags) : new RegExp(escapeRegex(find), flags)
      } catch {
        return 0
      }

      const matches = this.rawContent.match(regex)
      const count = matches ? matches.length : 0

      if (count > 0) {
        const newContent = this.rawContent.replace(regex, replace)
        this.setContent(newContent)
      }

      return count
    },

    markClean() {
      this.isDirty = false
    }
  }
})

// Helper functions
function buildTree(data: unknown, path: string[], expandedPaths: Set<string>): ToonNode[] {
  const nodes: ToonNode[] = []

  if (data === null) {
    return [{
      id: path.join('.') || 'root',
      key: path[path.length - 1] || 'null',
      value: null,
      type: 'null',
      path
    }]
  }

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemPath = [...path, String(index)]
      const pathStr = itemPath.join('.')
      const type = getType(item)

      nodes.push({
        id: pathStr,
        key: String(index),
        value: item,
        type,
        path: itemPath,
        expanded: expandedPaths.has(pathStr),
        children: (type === 'object' || type === 'array')
          ? buildTree(item, itemPath, expandedPaths)
          : undefined
      })
    })
  } else if (typeof data === 'object') {
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      const itemPath = [...path, key]
      const pathStr = itemPath.join('.')
      const type = getType(value)

      nodes.push({
        id: pathStr,
        key,
        value,
        type,
        path: itemPath,
        expanded: expandedPaths.has(pathStr),
        children: (type === 'object' || type === 'array')
          ? buildTree(value, itemPath, expandedPaths)
          : undefined
      })
    })
  }

  return nodes
}

function getType(value: unknown): ToonNode['type'] {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value as ToonNode['type']
}

function collectAllPaths(data: unknown, path: string[]): string[] {
  const paths: string[] = []

  if (data === null || typeof data !== 'object') return paths

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemPath = [...path, String(index)]
      paths.push(itemPath.join('.'))
      paths.push(...collectAllPaths(item, itemPath))
    })
  } else {
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      const itemPath = [...path, key]
      paths.push(itemPath.join('.'))
      paths.push(...collectAllPaths(value, itemPath))
    })
  }

  return paths
}

function findMatches(data: unknown, query: string, path: string[]): string[] {
  const results: string[] = []
  const lowerQuery = query.toLowerCase()

  if (data === null) return results

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemPath = [...path, String(index)]
      if (String(index).toLowerCase().includes(lowerQuery)) {
        results.push(itemPath.join('.'))
      }
      results.push(...findMatches(item, query, itemPath))
    })
  } else if (typeof data === 'object') {
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      const itemPath = [...path, key]
      if (key.toLowerCase().includes(lowerQuery)) {
        results.push(itemPath.join('.'))
      }
      results.push(...findMatches(value, query, itemPath))
    })
  } else {
    if (String(data).toLowerCase().includes(lowerQuery)) {
      results.push(path.join('.'))
    }
  }

  return results
}

function setNestedValue(obj: unknown, path: string[], value: unknown): void {
  if (path.length === 0 || obj === null || typeof obj !== 'object') return

  let current: Record<string, unknown> = obj as Record<string, unknown>
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i] as string
    const next = current[key]
    if (next === null || typeof next !== 'object') return
    current = next as Record<string, unknown>
  }

  const lastKey = path[path.length - 1] as string
  current[lastKey] = value
}

function deleteNestedValue(obj: unknown, path: string[]): void {
  if (path.length === 0 || obj === null || typeof obj !== 'object') return

  let current: Record<string, unknown> = obj as Record<string, unknown>
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i] as string
    const next = current[key]
    if (next === null || typeof next !== 'object') return
    current = next as Record<string, unknown>
  }

  const lastKey = path[path.length - 1] as string
  if (Array.isArray(current)) {
    current.splice(Number(lastKey), 1)
  } else {
    Reflect.deleteProperty(current, lastKey)
  }
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function safeStringify(data: unknown, fallback: string, indent?: number): string {
  if (data === null || data === undefined) return fallback
  try {
    return JSON.stringify(data, null, indent)
  } catch {
    return fallback
  }
}
