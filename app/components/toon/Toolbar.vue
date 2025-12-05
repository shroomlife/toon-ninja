<script setup lang="ts">
import { encode } from '@toon-format/toon'

const { t } = useI18n()
const toonStore = useToonStore()
const toast = useToast()

// Export format options
const exportItems = [
  [{
    label: 'TOON (.toon)',
    icon: 'i-lucide-file-code',
    onSelect: () => handleExport('toon'),
  }],
  [{
    label: 'JSON (.json)',
    icon: 'i-lucide-file-json',
    onSelect: () => handleExport('json'),
  }],
]

function handleUndo() {
  toonStore.undo()
}

function handleRedo() {
  toonStore.redo()
}

function handleFormat() {
  toonStore.format()
}

function handleClear() {
  toonStore.clear()
}

function handleCopy() {
  if (toonStore.rawContent) {
    navigator.clipboard.writeText(toonStore.rawContent)
    toast.add({
      title: t('success.copied'),
      color: 'success',
    })
  }
}

function handleCopyAsJson() {
  if (toonStore.parsedData) {
    const jsonContent = JSON.stringify(toonStore.parsedData, null, 2)
    navigator.clipboard.writeText(jsonContent)
    toast.add({
      title: t('success.copiedAsJson'),
      color: 'success',
    })
  }
}

async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText()
    const trimmed = text.trim()

    // Check if it's valid JSON and convert to TOON
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        const toonContent = encode(parsed, { indent: 2 })
        toonStore.setContent(toonContent)
        toast.add({
          title: t('success.jsonConverted'),
          color: 'success',
        })
        return
      }
      catch {
        // Not valid JSON, continue with raw paste
      }
    }

    // Paste as-is (already TOON or plain text)
    toonStore.setContent(text)
  }
  catch {
    toast.add({
      title: t('errors.parseError'),
      color: 'error',
    })
  }
}

function handleExport(format: 'toon' | 'json') {
  if (!toonStore.parsedData) return

  let content: string
  let extension: string
  let mimeType: string

  if (format === 'json') {
    content = JSON.stringify(toonStore.parsedData, null, 2)
    extension = 'json'
    mimeType = 'application/json'
  }
  else {
    content = encode(toonStore.parsedData, { indent: 2 })
    extension = 'toon'
    mimeType = 'text/plain'
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `toon-data.${extension}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  toast.add({
    title: t('success.exported'),
    color: 'success',
  })
}
</script>

<template>
  <div class="flex items-center gap-2 flex-wrap">
    <!-- Undo/Redo -->
    <div class="flex items-center">
      <UTooltip :text="`${t('actions.undo')} (Ctrl+Z)`">
        <UButton
          icon="i-lucide-undo-2"
          size="sm"
          color="neutral"
          variant="ghost"
          :disabled="!toonStore.canUndo"
          @click="handleUndo"
        />
      </UTooltip>
      <UTooltip :text="`${t('actions.redo')} (Ctrl+Y)`">
        <UButton
          icon="i-lucide-redo-2"
          size="sm"
          color="neutral"
          variant="ghost"
          :disabled="!toonStore.canRedo"
          @click="handleRedo"
        />
      </UTooltip>
    </div>

    <USeparator orientation="vertical" class="h-6" />

    <!-- Format -->
    <div class="flex items-center gap-1">
      <UTooltip :text="t('editor.format')">
        <UButton
          icon="i-lucide-code-2"
          size="sm"
          color="neutral"
          variant="ghost"
          :disabled="!toonStore.isValid || !toonStore.parsedData"
          @click="handleFormat"
        />
      </UTooltip>
    </div>

    <USeparator orientation="vertical" class="h-6" />

    <!-- Copy/Paste -->
    <div class="flex items-center gap-1">
      <UTooltip :text="`${t('actions.copy')} (Ctrl+C)`">
        <UButton
          icon="i-lucide-copy"
          size="sm"
          color="neutral"
          variant="ghost"
          :disabled="!toonStore.rawContent"
          @click="handleCopy"
        />
      </UTooltip>
      <UTooltip :text="t('actions.copyAsJson')">
        <UButton
          icon="i-lucide-braces"
          size="sm"
          color="neutral"
          variant="ghost"
          :disabled="!toonStore.parsedData"
          @click="handleCopyAsJson"
        />
      </UTooltip>
      <UTooltip :text="`${t('actions.paste')} (Ctrl+V)`">
        <UButton
          icon="i-lucide-clipboard-paste"
          size="sm"
          color="neutral"
          variant="ghost"
          @click="handlePaste"
        />
      </UTooltip>
    </div>

    <USeparator orientation="vertical" class="h-6" />

    <!-- Export/Clear -->
    <div class="flex items-center gap-1">
      <UDropdownMenu :items="exportItems">
        <UTooltip :text="t('actions.export')">
          <UButton
            icon="i-lucide-download"
            size="sm"
            color="neutral"
            variant="ghost"
            :disabled="!toonStore.parsedData"
          />
        </UTooltip>
      </UDropdownMenu>
      <UTooltip :text="t('actions.clear')">
        <UButton
          icon="i-lucide-trash-2"
          size="sm"
          color="neutral"
          variant="ghost"
          :disabled="!toonStore.rawContent"
          @click="handleClear"
        />
      </UTooltip>
    </div>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Validation status -->
    <UBadge
      v-if="toonStore.rawContent"
      :color="toonStore.isValid ? 'success' : 'error'"
      variant="subtle"
      size="sm"
    >
      {{ toonStore.isValid ? 'Valid TOON' : 'Invalid TOON' }}
    </UBadge>
  </div>
</template>
