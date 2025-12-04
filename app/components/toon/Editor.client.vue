<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { useColorMode } from '@vueuse/core'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorContainer = ref<HTMLDivElement>()
const toonStore = useToonStore()
const settingsStore = useSettingsStore()
const colorMode = useColorMode()

let editor: monaco.editor.IStandaloneCodeEditor | null = null

const editorTheme = computed(() => colorMode.value === 'dark' ? 'vs-dark' : 'vs')

onMounted(() => {
  if (!editorContainer.value) return

  // Configure JSON defaults
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: false,
    schemas: [],
    enableSchemaRequest: false
  })

  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: 'json',
    theme: editorTheme.value,
    fontSize: settingsStore.fontSize,
    wordWrap: settingsStore.wordWrap ? 'on' : 'off',
    lineNumbers: settingsStore.showLineNumbers ? 'on' : 'off',
    minimap: { enabled: settingsStore.showMinimap },
    tabSize: settingsStore.tabSize,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    folding: true,
    formatOnPaste: true,
    formatOnType: false,
    renderWhitespace: 'selection',
    bracketPairColorization: { enabled: true },
    padding: { top: 8, bottom: 8 }
  })

  // Handle content changes
  editor.onDidChangeModelContent(() => {
    if (editor) {
      const value = editor.getValue()
      emit('update:modelValue', value)
    }
  })

  // Add keyboard shortcuts
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    // Save action
    toonStore.markClean()
  })

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
    // Format action
    toonStore.format()
  })
})

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    const position = editor.getPosition()
    editor.setValue(newValue)
    if (position) {
      editor.setPosition(position)
    }
  }
})

// Watch for theme changes
watch(editorTheme, (theme) => {
  if (editor) {
    monaco.editor.setTheme(theme)
  }
})

// Watch for settings changes
watch(() => settingsStore.fontSize, (size) => {
  editor?.updateOptions({ fontSize: size })
})

watch(() => settingsStore.wordWrap, (wrap) => {
  editor?.updateOptions({ wordWrap: wrap ? 'on' : 'off' })
})

watch(() => settingsStore.showLineNumbers, (show) => {
  editor?.updateOptions({ lineNumbers: show ? 'on' : 'off' })
})

watch(() => settingsStore.showMinimap, (show) => {
  editor?.updateOptions({ minimap: { enabled: show } })
})

onUnmounted(() => {
  editor?.dispose()
})
</script>

<template>
  <div ref="editorContainer" class="w-full h-full min-h-[300px]" />
</template>
