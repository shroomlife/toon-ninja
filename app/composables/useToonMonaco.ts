import type * as Monaco from 'monaco-editor'
import { useToonStore } from '~/stores/toon'

let languageRegistered = false
let validationTimeout: ReturnType<typeof setTimeout> | null = null

export const useToonMonaco = () => {
  const toonStore = useToonStore()

  // Register TOON language (synchronous, takes monaco instance as param)
  const registerToonLanguage = (monaco: typeof Monaco) => {
    // Check if already registered
    if (languageRegistered) {
      return
    }

    const languages = monaco.languages.getLanguages()
    if (languages.some(lang => lang.id === 'toon')) {
      languageRegistered = true
      return
    }

    // Register language
    monaco.languages.register({
      id: 'toon',
      extensions: ['.toon'],
      aliases: ['TOON', 'toon'],
      mimetypes: ['text/toon'],
    })

    // Monarch tokenizer for syntax highlighting
    monaco.languages.setMonarchTokensProvider('toon', {
      tokenizer: {
        root: [
          // Comments (if TOON supports them)
          [/#.*$/, 'comment'],

          // Tabular Array Header: items[3]{id,name,price}:
          [/\w+\[\d+\]\{[^}]+\}:/, 'keyword.array.tabular'],

          // Simple Array Header: items[3]:
          [/\w+\[\d+\]:/, 'keyword.array'],

          // List item marker
          [/^\s*-\s/, 'delimiter.list'],

          // Key-Value separator
          [/:/, 'delimiter.colon'],

          // Keys (before colon)
          [/^(\s*)([a-zA-Z_][\w.]*)(?=\s*:)/, ['white', 'variable.key']],

          // Booleans
          [/\b(true|false)\b/, 'keyword.boolean'],

          // Null
          [/\bnull\b/, 'keyword.null'],

          // Numbers (integers and floats)
          [/-?\d+\.\d+/, 'number.float'],
          [/-?\d+/, 'number'],

          // Quoted strings
          [/"([^"\\]|\\.)*"/, 'string.quoted'],

          // Delimiters in tabular data
          [/[,\t|]/, 'delimiter.separator'],

          // Unquoted string values (catch-all for values after colon)
          [/[^\s,\t|][^,\t|\n]*/, 'string.unquoted'],
        ],
      },
    })

    // Language configuration
    monaco.languages.setLanguageConfiguration('toon', {
      comments: {
        lineComment: '#',
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '"', close: '"' },
      ],
      surroundingPairs: [
        { open: '"', close: '"' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
      ],
      folding: {
        offSide: true, // Indentation-based folding like Python/YAML
      },
      indentationRules: {
        increaseIndentPattern: /:\s*$/,
        decreaseIndentPattern: /^\s*$/,
      },
    })

    // Define custom theme tokens
    monaco.editor.defineTheme('toon-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword.array.tabular', foreground: 'C586C0', fontStyle: 'bold' },
        { token: 'keyword.array', foreground: 'C586C0' },
        { token: 'keyword.boolean', foreground: '569CD6' },
        { token: 'keyword.null', foreground: '569CD6', fontStyle: 'italic' },
        { token: 'variable.key', foreground: '9CDCFE' },
        { token: 'string.quoted', foreground: 'CE9178' },
        { token: 'string.unquoted', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'number.float', foreground: 'B5CEA8' },
        { token: 'delimiter.colon', foreground: 'D4D4D4' },
        { token: 'delimiter.separator', foreground: '808080' },
        { token: 'delimiter.list', foreground: 'C586C0' },
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      ],
      colors: {},
    })

    monaco.editor.defineTheme('toon-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword.array.tabular', foreground: 'AF00DB', fontStyle: 'bold' },
        { token: 'keyword.array', foreground: 'AF00DB' },
        { token: 'keyword.boolean', foreground: '0000FF' },
        { token: 'keyword.null', foreground: '0000FF', fontStyle: 'italic' },
        { token: 'variable.key', foreground: '001080' },
        { token: 'string.quoted', foreground: 'A31515' },
        { token: 'string.unquoted', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'number.float', foreground: '098658' },
        { token: 'delimiter.colon', foreground: '000000' },
        { token: 'delimiter.separator', foreground: '808080' },
        { token: 'delimiter.list', foreground: 'AF00DB' },
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
      ],
      colors: {},
    })
  }

  // Validate TOON content and set markers
  const validateContent = (
    monaco: typeof Monaco,
    editor: Monaco.editor.IStandaloneCodeEditor,
    debounceMs = 300,
  ) => {
    const model = editor.getModel()
    if (!model) return

    // Clear previous timeout
    if (validationTimeout) {
      clearTimeout(validationTimeout)
    }

    // Debounce validation
    validationTimeout = setTimeout(() => {
      const markers: Monaco.editor.IMarkerData[] = []
      const content = model.getValue()

      // Use store's validation
      toonStore.setContent(content, false)

      // Add markers from store errors
      if (!toonStore.isValid && toonStore.errors.length > 0) {
        toonStore.errors.forEach((error) => {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            message: error.message,
            startLineNumber: error.line,
            startColumn: error.column,
            endLineNumber: error.line,
            endColumn: model.getLineLength(error.line) + 1,
          })
        })
      }

      // Additional syntax checks
      const lines = content.split('\n')
      const indentSize = 2

      lines.forEach((line, index) => {
        const lineNumber = index + 1
        const trimmed = line.trimStart()

        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) return

        const leadingSpaces = line.length - line.trimStart().length

        // Check indentation consistency
        if (leadingSpaces % indentSize !== 0) {
          markers.push({
            severity: monaco.MarkerSeverity.Warning,
            message: `Indentation should be a multiple of ${indentSize} spaces`,
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: leadingSpaces + 1,
          })
        }

        // Check array header syntax
        const arrayHeaderMatch = trimmed.match(/^(\w+)\[(\d+)\](\{([^}]*)\})?:?\s*$/)
        if (arrayHeaderMatch && !trimmed.endsWith(':')) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            message: 'Array header must end with colon (:)',
            startLineNumber: lineNumber,
            startColumn: leadingSpaces + 1,
            endLineNumber: lineNumber,
            endColumn: line.length + 1,
          })
        }

        // Check for key-value format
        if (trimmed.includes(':') && !trimmed.endsWith(':') && !trimmed.startsWith('-')) {
          const colonIndex = trimmed.indexOf(':')
          const key = trimmed.slice(0, colonIndex).trim()

          // Validate key format (alphanumeric, underscore, dot)
          if (key && !/^[\w.]+$/.test(key) && !/^".*"$/.test(key)) {
            markers.push({
              severity: monaco.MarkerSeverity.Warning,
              message: 'Key should be alphanumeric (use quotes for special characters)',
              startLineNumber: lineNumber,
              startColumn: leadingSpaces + 1,
              endLineNumber: lineNumber,
              endColumn: leadingSpaces + colonIndex + 1,
            })
          }
        }
      })

      // Set markers on model
      monaco.editor.setModelMarkers(model, 'toon-validator', markers)
    }, debounceMs)
  }

  // Get editor options for TOON
  const getEditorOptions = (isDark: boolean): Monaco.editor.IStandaloneEditorConstructionOptions => {
    return {
      language: 'toon',
      theme: isDark ? 'toon-dark' : 'toon-light',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      tabSize: 2,
      insertSpaces: true,
      folding: true,
      foldingStrategy: 'indentation',
      glyphMargin: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      suggestOnTriggerCharacters: false,
      quickSuggestions: false,
      formatOnPaste: false,
      formatOnType: false,
    }
  }

  // Cleanup
  const dispose = () => {
    if (validationTimeout) {
      clearTimeout(validationTimeout)
      validationTimeout = null
    }
  }

  return {
    registerToonLanguage,
    validateContent,
    getEditorOptions,
    dispose,
  }
}
