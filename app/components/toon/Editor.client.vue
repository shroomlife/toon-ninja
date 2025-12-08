<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { encode } from '@toon-format/toon'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: string
  readOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readOnly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorContainer = ref<HTMLDivElement | null>(null)
const colorMode = useColorMode()
const settingsStore = useSettingsStore()
const toast = useToast()
const { t } = useI18n()

let editor: monaco.editor.IStandaloneCodeEditor | null = null
let isConvertingJson = false

// Try to detect and convert JSON to TOON
function tryConvertJsonToToon(content: string): string | null {
  const trimmed = content.trim()

  // Check if it looks like JSON
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return null
  }

  try {
    const parsed = JSON.parse(trimmed)
    return encode(parsed, { indent: 2 })
  }
  catch {
    return null
  }
}

const initEditor = () => {
  if (!editorContainer.value) {
    console.error('No editor container!')
    return
  }

  if (editor) {
    // Already initialized
    return
  }

  try {
    const theme = colorMode.value === 'dark' ? 'vs-dark' : 'vs'

    editor = monaco.editor.create(editorContainer.value, {
      value: props.modelValue || '',
      language: 'plaintext',
      theme: theme,
      readOnly: props.readOnly,
      fontSize: settingsStore.fontSize,
      wordWrap: settingsStore.wordWrap ? 'on' : 'off',
      lineNumbers: settingsStore.showLineNumbers ? 'on' : 'off',
      minimap: { enabled: settingsStore.showMinimap },
      automaticLayout: true,
    })

    editor.onDidChangeModelContent(() => {
      if (editor && !isConvertingJson) {
        emit('update:modelValue', editor.getValue())
      }
    })

    // Listen for paste events to auto-convert JSON
    editor.onDidPaste(() => {
      if (!editor) return

      const content = editor.getValue()
      const toonContent = tryConvertJsonToToon(content)

      if (toonContent) {
        isConvertingJson = true
        editor.setValue(toonContent)
        isConvertingJson = false
        emit('update:modelValue', toonContent)
        toast.add({
          title: t('success.jsonConverted'),
          color: 'success',
        })
      }
    })
  }
  catch (e) {
    console.error('Error creating Monaco editor:', e)
  }
}

onMounted(async () => {
  await nextTick()
  initEditor()
})

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (editor && newValue !== editor.getValue()) {
    editor.setValue(newValue)
  }
})

// Watch theme changes
watch(() => colorMode.value, (newMode) => {
  if (editor) {
    monaco.editor.setTheme(newMode === 'dark' ? 'vs-dark' : 'vs')
  }
})

// Watch settings changes
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
  <div ref="editorContainer" class="editor-container w-full h-full" />
</template>
