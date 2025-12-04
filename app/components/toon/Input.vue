<script setup lang="ts">
const { t } = useI18n()
const toonStore = useToonStore()
const toast = useToast()

// Sync with store
const inputContent = computed({
  get: () => toonStore.rawContent,
  set: (value: string) => toonStore.setContent(value, false)
})

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      inputContent.value = text
      toast.add({
        title: t('input.pasted'),
        description: t('input.pastedDescription'),
        color: 'info',
        icon: 'i-lucide-clipboard-check'
      })
    }
  } catch {
    toast.add({
      title: t('input.error'),
      description: t('input.clipboardError'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}

const clearInput = () => {
  inputContent.value = ''
}
</script>

<template>
  <div class="flex flex-col h-full p-4 gap-3">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('input.title') }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t('input.subtitle') }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UTooltip :text="t('hints.pasteFromClipboard')">
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-clipboard"
            size="sm"
            @click="pasteFromClipboard"
          >
            {{ t('input.paste') }}
          </UButton>
        </UTooltip>

        <UTooltip v-if="inputContent" :text="t('hints.clearInput')">
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-x"
            size="sm"
            @click="clearInput"
          >
            {{ t('input.clear') }}
          </UButton>
        </UTooltip>
      </div>
    </div>

    <!-- Input Area -->
    <UTextarea
      v-model="inputContent"
      :placeholder="t('input.placeholder')"
      class="flex-1 font-mono text-sm"
      :rows="15"
      autoresize
    />

    <!-- Info -->
    <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <UIcon name="i-lucide-info" class="w-3.5 h-3.5" />
      <span>{{ t('input.aboutToon') }}</span>
      <UButton
        variant="link"
        color="primary"
        to="https://toonformat.dev/reference/spec"
        target="_blank"
        size="xs"
        class="p-0"
        trailing-icon="i-lucide-external-link"
      >
        {{ t('input.learnMore') }}
      </UButton>
    </div>
  </div>
</template>
