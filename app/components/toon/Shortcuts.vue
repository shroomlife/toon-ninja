<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits<{
  close: []
}>()

const shortcuts = [
  { keys: ['Ctrl', 'S'], action: 'shortcuts.save' },
  { keys: ['Ctrl', 'Z'], action: 'shortcuts.undo' },
  { keys: ['Ctrl', 'Shift', 'Z'], action: 'shortcuts.redo' },
  { keys: ['Ctrl', 'Shift', 'F'], action: 'shortcuts.format' },
  { keys: ['Ctrl', 'F'], action: 'shortcuts.search' },
  { keys: ['Ctrl', 'O'], action: 'shortcuts.import' },
  { keys: ['Ctrl', 'Shift', 'S'], action: 'shortcuts.export' }
]
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('shortcuts.title') }}
      </h3>
      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="emit('close')"
      />
    </div>

    <div class="space-y-2">
      <div
        v-for="(shortcut, index) in shortcuts"
        :key="index"
        class="flex items-center justify-between py-2 border-b border-default last:border-0"
      >
        <span class="text-sm">{{ t(shortcut.action) }}</span>
        <div class="flex items-center gap-1">
          <UKbd v-for="key in shortcut.keys" :key="key" size="sm">
            {{ key }}
          </UKbd>
        </div>
      </div>
    </div>
  </div>
</template>
