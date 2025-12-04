<script setup lang="ts">
const { t } = useI18n()
const toonStore = useToonStore()

const previewData = computed(() => {
  if (!toonStore.parsedData) return null
  return toonStore.parsedData
})

function getPreviewType(data: unknown): string {
  if (data === null) return 'null'
  if (Array.isArray(data)) return 'array'
  return typeof data
}

function formatPreviewValue(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-default">
      <h3 class="font-semibold text-sm">
        {{ t('preview.title') }}
      </h3>
      <div class="flex items-center gap-2">
        <UBadge
          v-if="toonStore.isValid && toonStore.parsedData"
          color="success"
          variant="subtle"
          size="xs"
        >
          {{ t('editor.validJson') }}
        </UBadge>
        <UBadge
          v-else-if="!toonStore.isValid"
          color="error"
          variant="subtle"
          size="xs"
        >
          {{ t('editor.invalidJson') }}
        </UBadge>
      </div>
    </div>

    <!-- Preview content -->
    <div class="flex-1 overflow-auto p-4">
      <template v-if="previewData">
        <!-- Object/Array display -->
        <div v-if="getPreviewType(previewData) === 'object' || getPreviewType(previewData) === 'array'">
          <div
            v-for="(value, key) in previewData"
            :key="String(key)"
            class="mb-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-default"
          >
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-primary">{{ key }}</span>
              <UBadge
                :color="getPreviewType(value) === 'string' ? 'success'
                  : getPreviewType(value) === 'number' ? 'info'
                    : getPreviewType(value) === 'boolean' ? 'warning'
                      : 'neutral'"
                variant="subtle"
                size="xs"
              >
                {{ getPreviewType(value) }}
              </UBadge>
            </div>
            <div class="text-sm text-neutral-600 dark:text-neutral-400 break-all">
              {{ formatPreviewValue(value) }}
            </div>
          </div>
        </div>

        <!-- Primitive display -->
        <div v-else class="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-default">
          <UBadge
            :color="getPreviewType(previewData) === 'string' ? 'success'
              : getPreviewType(previewData) === 'number' ? 'info'
                : getPreviewType(previewData) === 'boolean' ? 'warning'
                  : 'neutral'"
            variant="subtle"
            size="xs"
            class="mb-2"
          >
            {{ getPreviewType(previewData) }}
          </UBadge>
          <div class="text-lg">
            {{ formatPreviewValue(previewData) }}
          </div>
        </div>
      </template>

      <!-- Empty state -->
      <div v-else class="flex flex-col items-center justify-center h-full text-neutral-500">
        <UIcon name="i-lucide-eye" class="w-12 h-12 mb-2" />
        <p class="text-sm">
          {{ t('preview.noData') }}
        </p>
      </div>

      <!-- Error state -->
      <div
        v-if="!toonStore.isValid && toonStore.errorMessage"
        class="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      >
        <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
          <UIcon name="i-lucide-alert-circle" class="w-4 h-4" />
          <span class="font-medium">{{ t('errors.parseError') }}</span>
        </div>
        <p class="mt-1 text-sm text-red-500 dark:text-red-400">
          {{ toonStore.errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>
