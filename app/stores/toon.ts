import { defineStore } from 'pinia'
import { decode, encode } from '@toon-format/toon'
import type { TreeItem } from '@nuxt/ui'

// === Types ===
export interface ToonTreeItem extends TreeItem {
  id: string
  label: string
  icon?: string
  value?: unknown
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  path: string[]
  isArrayItem?: boolean
  arrayIndex?: number
  children?: ToonTreeItem[]
  defaultExpanded?: boolean
}

export interface HistoryState {
  content: string
  timestamp: number
}

export interface ValidationError {
  line: number
  column: number
  message: string
}

// === Store ===
export const useToonStore = defineStore('toon', {
  state: () => ({
    rawContent: '' as string,
    parsedData: null as unknown,
    isValid: true,
    errorMessage: '',
    errors: [] as ValidationError[],
    history: [] as HistoryState[],
    historyIndex: -1,
    maxHistory: 50,
    selectedNodePath: [] as string[],
    expandedKeys: [] as string[],
    searchQuery: '',
    searchResults: [] as string[],
    compareContent: '' as string,
    isDirty: false,
    isLoading: false
  }),

  getters: {
    canUndo: (state): boolean => state.historyIndex > 0,
    canRedo: (state): boolean => state.historyIndex < state.history.length - 1,

    hasContent: (state): boolean => state.rawContent.trim().length > 0,

    treeItems(): ToonTreeItem[] {
      if (!this.parsedData) return []
      return buildTreeItems(this.parsedData, [])
    },

    formattedContent: (state): string => {
      if (!state.parsedData) return state.rawContent
      try {
        return encode(state.parsedData, { indent: 2 })
      } catch {
        return state.rawContent
      }
    }
  },

  actions: {
    // === Content Management ===
    setContent(content: string, addToHistory = true) {
      this.rawContent = content
      this.isDirty = true
      this.validateAndParse()

      if (addToHistory && content !== this.history[this.historyIndex]?.content) {
        this.addToHistory(content)
      }
    },

    validateAndParse() {
      this.errors = []

      if (!this.rawContent.trim()) {
        this.parsedData = null
        this.isValid = true
        this.errorMessage = ''
        return
      }

      try {
        this.parsedData = decode(this.rawContent, { strict: true })
        this.isValid = true
        this.errorMessage = ''
      } catch (e) {
        this.isValid = false
        const errorMsg = e instanceof Error ? e.message : 'Invalid TOON'
        this.errorMessage = errorMsg

        // Try to extract line number from error message
        const lineMatch = errorMsg.match(/line\s*(\d+)/i)
        const colMatch = errorMsg.match(/column\s*(\d+)/i)

        this.errors.push({
          line: lineMatch?.[1] ? parseInt(lineMatch[1], 10) : 1,
          column: colMatch?.[1] ? parseInt(colMatch[1], 10) : 1,
          message: errorMsg
        })

        this.parsedData = null
      }
    },

    // === History Management ===
    addToHistory(content: string) {
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1)
      }

      this.history.push({
        content,
        timestamp: Date.now()
      })

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

    // === Formatting ===
    format() {
      if (this.isValid && this.parsedData) {
        try {
          const formatted = encode(this.parsedData, { indent: 2 })
          this.setContent(formatted)
        } catch (e) {
          console.error('Format error:', e)
        }
      }
    },

    // === Node Operations ===
    addNode(path: string[], value: unknown, key?: string) {
      if (!this.parsedData) {
        // Create new root object/array
        if (key) {
          this.parsedData = { [key]: value }
        } else if (Array.isArray(value)) {
          this.parsedData = [value]
        } else {
          this.parsedData = value
        }
      } else {
        const newData = JSON.parse(JSON.stringify(this.parsedData))
        const parent = path.length > 0 ? getNestedValue(newData, path) : newData

        if (Array.isArray(parent)) {
          parent.push(value)
        } else if (parent && typeof parent === 'object') {
          if (key) {
            (parent as Record<string, unknown>)[key] = value
          }
        }

        this.parsedData = newData
      }

      this.syncContentFromData()
    },

    editNode(path: string[], newValue: unknown, newKey?: string) {
      if (!this.parsedData || path.length === 0) return

      const newData = JSON.parse(JSON.stringify(this.parsedData))

      if (newKey !== undefined && path.length > 0) {
        // Key rename
        const parentPath = path.slice(0, -1)
        const oldKey = path[path.length - 1]!
        const parent = parentPath.length > 0
          ? getNestedValue(newData, parentPath)
          : newData

        if (parent && typeof parent === 'object' && !Array.isArray(parent)) {
          const obj = parent as Record<string, unknown>
          if (oldKey !== newKey) {
            obj[newKey] = newValue
            // Use object spread to remove the old key instead of delete
            const { [oldKey]: _, ...rest } = obj
            Object.keys(obj).forEach(k => Reflect.deleteProperty(obj, k))
            Object.assign(obj, rest)
          } else {
            obj[oldKey] = newValue
          }
        }
      } else {
        setNestedValue(newData, path, newValue)
      }

      this.parsedData = newData
      this.syncContentFromData()
    },

    deleteNode(path: string[]) {
      if (!this.parsedData || path.length === 0) return

      const newData = JSON.parse(JSON.stringify(this.parsedData))
      deleteNestedValue(newData, path)
      this.parsedData = newData
      this.syncContentFromData()
    },

    duplicateNode(path: string[]) {
      if (!this.parsedData || path.length === 0) return

      const newData = JSON.parse(JSON.stringify(this.parsedData))
      const parentPath = path.slice(0, -1)
      const key = path[path.length - 1]!
      const parent = parentPath.length > 0
        ? getNestedValue(newData, parentPath)
        : newData

      if (Array.isArray(parent)) {
        const index = parseInt(key, 10)
        const value = JSON.parse(JSON.stringify(parent[index]))
        parent.splice(index + 1, 0, value)
      } else if (parent && typeof parent === 'object') {
        const obj = parent as Record<string, unknown>
        const value = JSON.parse(JSON.stringify(obj[key]))
        let newKey = `${key}_copy`
        let counter = 1
        while (newKey in obj) {
          newKey = `${key}_copy_${counter++}`
        }
        obj[newKey] = value
      }

      this.parsedData = newData
      this.syncContentFromData()
    },

    moveNode(fromPath: string[], toPath: string[], position: 'before' | 'after' | 'inside') {
      if (!this.parsedData) return

      const newData = JSON.parse(JSON.stringify(this.parsedData))

      // Get the value to move
      const value = getNestedValue(newData, fromPath)
      if (value === undefined) return

      // Delete from original location
      deleteNestedValue(newData, fromPath)

      // Insert at new location
      if (position === 'inside') {
        const target = getNestedValue(newData, toPath)
        if (Array.isArray(target)) {
          target.push(value)
        } else if (target && typeof target === 'object') {
          const key = fromPath[fromPath.length - 1]!
          ;(target as Record<string, unknown>)[key] = value
        }
      } else {
        const parentPath = toPath.slice(0, -1)
        const parent = parentPath.length > 0
          ? getNestedValue(newData, parentPath)
          : newData

        if (Array.isArray(parent)) {
          const index = parseInt(toPath[toPath.length - 1]!, 10)
          const insertIndex = position === 'after' ? index + 1 : index
          parent.splice(insertIndex, 0, value)
        }
      }

      this.parsedData = newData
      this.syncContentFromData()
    },

    // === Sync ===
    syncContentFromData() {
      if (this.parsedData) {
        try {
          const content = encode(this.parsedData, { indent: 2 })
          this.rawContent = content
          this.isDirty = true
          this.isValid = true
          this.errorMessage = ''
          this.errors = []
          this.addToHistory(content)
        } catch (e) {
          console.error('Encode error:', e)
        }
      }
    },

    // === Tree State ===
    toggleExpanded(key: string) {
      const index = this.expandedKeys.indexOf(key)
      if (index > -1) {
        this.expandedKeys.splice(index, 1)
      } else {
        this.expandedKeys.push(key)
      }
    },

    expandAll() {
      if (!this.parsedData) return
      this.expandedKeys = collectAllKeys(this.parsedData, [])
    },

    collapseAll() {
      this.expandedKeys = []
    },

    selectNode(path: string[]) {
      this.selectedNodePath = path
    },

    // === Search ===
    setSearchQuery(query: string) {
      this.searchQuery = query
      this.searchResults = query ? findMatches(this.parsedData, query, []) : []
    },

    // === Compare ===
    setCompareContent(content: string) {
      this.compareContent = content
    },

    // === Utility ===
    clear() {
      this.rawContent = ''
      this.parsedData = null
      this.isValid = true
      this.errorMessage = ''
      this.errors = []
      this.isDirty = false
      this.selectedNodePath = []
      this.expandedKeys = []
      this.searchQuery = ''
      this.searchResults = []
    },

    markClean() {
      this.isDirty = false
    },

    // === Batch Replace ===
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

    getNodeByPath(path: string[]): unknown {
      return getNestedValue(this.parsedData, path)
    }
  }
})

// === Helper Functions ===

function buildTreeItems(data: unknown, path: string[]): ToonTreeItem[] {
  const items: ToonTreeItem[] = []

  if (data === null) {
    return [{
      id: path.join('.') || 'null',
      label: 'null',
      icon: 'i-lucide-circle-slash',
      value: null,
      type: 'null',
      path
    }]
  }

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemPath = [...path, String(index)]
      const id = itemPath.join('.')
      const type = getType(item)
      const hasChildren = type === 'object' || type === 'array'

      items.push({
        id,
        label: `[${index}]`,
        icon: getTypeIcon(type),
        value: item,
        type,
        path: itemPath,
        isArrayItem: true,
        arrayIndex: index,
        defaultExpanded: false,
        children: hasChildren ? buildTreeItems(item, itemPath) : undefined
      })
    })
  } else if (typeof data === 'object') {
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      const itemPath = [...path, key]
      const id = itemPath.join('.')
      const type = getType(value)
      const hasChildren = type === 'object' || type === 'array'

      items.push({
        id,
        label: key,
        icon: getTypeIcon(type),
        value,
        type,
        path: itemPath,
        defaultExpanded: false,
        children: hasChildren ? buildTreeItems(value, itemPath) : undefined
      })
    })
  }

  return items
}

function getType(value: unknown): ToonTreeItem['type'] {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  const t = typeof value
  if (t === 'string') return 'string'
  if (t === 'number') return 'number'
  if (t === 'boolean') return 'boolean'
  if (t === 'object') return 'object'
  return 'string'
}

function getTypeIcon(type: ToonTreeItem['type']): string {
  switch (type) {
    case 'object': return 'i-lucide-braces'
    case 'array': return 'i-lucide-brackets'
    case 'string': return 'i-lucide-text'
    case 'number': return 'i-lucide-hash'
    case 'boolean': return 'i-lucide-toggle-left'
    case 'null': return 'i-lucide-circle-slash'
    default: return 'i-lucide-file'
  }
}

function collectAllKeys(data: unknown, path: string[]): string[] {
  const keys: string[] = []

  if (data === null || typeof data !== 'object') return keys

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemPath = [...path, String(index)]
      keys.push(itemPath.join('.'))
      keys.push(...collectAllKeys(item, itemPath))
    })
  } else {
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      const itemPath = [...path, key]
      keys.push(itemPath.join('.'))
      keys.push(...collectAllKeys(value, itemPath))
    })
  }

  return keys
}

function findMatches(data: unknown, query: string, path: string[]): string[] {
  const results: string[] = []
  const lowerQuery = query.toLowerCase()

  if (data === null) return results

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemPath = [...path, String(index)]
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

function getNestedValue(obj: unknown, path: string[]): unknown {
  if (path.length === 0) return obj

  let current: unknown = obj
  for (const key of path) {
    if (current === null || typeof current !== 'object') return undefined
    if (Array.isArray(current)) {
      current = current[parseInt(key!, 10)]
    } else {
      current = (current as Record<string, unknown>)[key!]
    }
  }
  return current
}

function setNestedValue(obj: unknown, path: string[], value: unknown): void {
  if (path.length === 0 || obj === null || typeof obj !== 'object') return

  let current: unknown = obj
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]!
    if (current === null || typeof current !== 'object') return
    if (Array.isArray(current)) {
      current = current[parseInt(key, 10)]
    } else {
      current = (current as Record<string, unknown>)[key]
    }
  }

  const lastKey = path[path.length - 1]!
  if (Array.isArray(current)) {
    current[parseInt(lastKey, 10)] = value
  } else if (current && typeof current === 'object') {
    (current as Record<string, unknown>)[lastKey] = value
  }
}

function deleteNestedValue(obj: unknown, path: string[]): void {
  if (path.length === 0 || obj === null || typeof obj !== 'object') return

  let current: unknown = obj
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]!
    if (current === null || typeof current !== 'object') return
    if (Array.isArray(current)) {
      current = current[parseInt(key, 10)]
    } else {
      current = (current as Record<string, unknown>)[key]
    }
  }

  const lastKey = path[path.length - 1]!
  if (Array.isArray(current)) {
    current.splice(parseInt(lastKey, 10), 1)
  } else if (current && typeof current === 'object') {
    Reflect.deleteProperty(current as Record<string, unknown>, lastKey)
  }
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
