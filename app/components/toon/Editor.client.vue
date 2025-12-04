<script setup lang="ts">
import * as monaco from 'monaco-editor'

interface Props {
  modelValue: string
  readOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readOnly: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorContainer = ref<HTMLDivElement | null>(null)
const colorMode = useColorMode()

let editor: monaco.editor.IStandaloneCodeEditor | null = null

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

    console.log('Creating Monaco editor...', editorContainer.value)

    editor = monaco.editor.create(editorContainer.value, {
      value: props.modelValue || '# Enter TOON content here',
      language: 'plaintext',
      theme: theme,
      readOnly: props.readOnly,
      fontSize: 14,
      wordWrap: 'on',
      lineNumbers: 'on',
      minimap: { enabled: false },
      automaticLayout: true
    })

    console.log('Monaco editor created:', editor)

    editor.onDidChangeModelContent(() => {
      if (editor) {
        emit('update:modelValue', editor.getValue())
      }
    })
  } catch (e) {
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

onUnmounted(() => {
  editor?.dispose()
})
</script>

<template>
  <div ref="editorContainer" class="editor-container w-full h-full" />
</template>
