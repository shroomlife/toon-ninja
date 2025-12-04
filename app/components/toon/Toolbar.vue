<script setup lang="ts">
const { t, locale, locales } = useI18n()
const toonStore = useToonStore()
const toast = useToast()

const availableLocales = computed(() => {
  return (locales.value as Array<{ code: string, name: string }>).map(l => ({
    label: l.name,
    value: l.code
  }))
})

function handleUndo() {
  toonStore.undo()
}

function handleRedo() {
  toonStore.redo()
}

function handleFormat() {
  toonStore.format()
}

function handleMinify() {
  toonStore.minify()
}

function handleClear() {
  toonStore.clear()
}

function handleCopy() {
  if (toonStore.rawContent) {
    navigator.clipboard.writeText(toonStore.rawContent)
    toast.add({
      title: t('success.copied'),
      color: 'success'
    })
  }
}

async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText()
    toonStore.setContent(text)
  } catch {
    toast.add({
      title: t('errors.parseError'),
      color: 'error'
    })
  }
}

function handleExport() {
  if (!toonStore.rawContent) return

  const blob = new Blob([toonStore.rawContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = toonStore.fileName || 'toon-data.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  toast.add({
    title: t('success.exported'),
    color: 'success'
  })
}

function setLocale(code: string) {
  locale.value = code
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

    <!-- Format/Minify -->
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
      <UTooltip :text="t('editor.minify')">
        <UButton
          icon="i-lucide-minimize-2"
          size="sm"
          color="neutral"
          variant="ghost"
          :disabled="!toonStore.isValid || !toonStore.parsedData"
          @click="handleMinify"
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
      <UTooltip :text="t('actions.export')">
        <UButton
          icon="i-lucide-download"
          size="sm"
          color="neutral"
          variant="ghost"
          :disabled="!toonStore.rawContent"
          @click="handleExport"
        />
      </UTooltip>
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
      {{ toonStore.isValid ? t('editor.validJson') : t('editor.invalidJson') }}
    </UBadge>

    <!-- Dirty indicator -->
    <UBadge
      v-if="toonStore.isDirty"
      color="warning"
      variant="subtle"
      size="sm"
    >
      Unsaved
    </UBadge>

    <!-- Language selector -->
    <UDropdownMenu
      :items="availableLocales.map(l => ({
        label: l.label,
        onSelect: () => setLocale(l.value)
      }))"
    >
      <UButton
        icon="i-lucide-languages"
        size="sm"
        color="neutral"
        variant="ghost"
      />
    </UDropdownMenu>
  </div>
</template>
