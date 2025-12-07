<script setup lang="ts">
import { diffLines, type Change } from 'diff'
import { useI18n } from '#imports'

const { t } = useI18n()
const toonStore = useToonStore()

const leftContent = ref('')
const rightContent = ref('')
const showLeftInput = ref(true)

const diffResult = computed<Change[]>(() => {
  if (!leftContent.value || !rightContent.value) return []
  return diffLines(leftContent.value, rightContent.value)
})

const stats = computed(() => {
  const result = { additions: 0, deletions: 0, unchanged: 0 }
  diffResult.value.forEach((part) => {
    const lines = part.count ?? 0
    if (part.added) result.additions += lines
    else if (part.removed) result.deletions += lines
    else result.unchanged += lines
  })
  return result
})

function loadCurrentAsLeft() {
  leftContent.value = toonStore.formattedContent
  showLeftInput.value = false
}

function loadCurrentAsRight() {
  rightContent.value = toonStore.formattedContent
}

function swapContents() {
  const temp = leftContent.value
  leftContent.value = rightContent.value
  rightContent.value = temp
}

function clearAll() {
  leftContent.value = ''
  rightContent.value = ''
  showLeftInput.value = true
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-default">
      <h3 class="font-semibold">
        {{ t('diff.title') }}
      </h3>
      <div class="flex items-center gap-2">
        <UBadge color="success" variant="subtle" size="sm">
          +{{ stats.additions }} {{ t('diff.additions') }}
        </UBadge>
        <UBadge color="error" variant="subtle" size="sm">
          -{{ stats.deletions }} {{ t('diff.deletions') }}
        </UBadge>
        <UTooltip :text="t('hints.swap')">
          <UButton
            icon="i-lucide-arrow-left-right"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="swapContents"
          >
            Swap
          </UButton>
        </UTooltip>
        <UTooltip :text="t('hints.clearDiff')">
          <UButton
            icon="i-lucide-trash-2"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="clearAll"
          >
            Clear
          </UButton>
        </UTooltip>
      </div>
    </div>

    <!-- Content area -->
    <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
      <!-- Left panel (Original) -->
      <div class="flex-1 flex flex-col border-r border-default min-h-0">
        <div class="flex items-center justify-between px-3 py-2 border-b border-default bg-neutral-50 dark:bg-neutral-800/50">
          <span class="text-sm font-medium">{{ t('diff.original') }}</span>
          <UTooltip :text="t('hints.loadCurrent')">
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="!toonStore.formattedContent"
              @click="loadCurrentAsLeft"
            >
              Load current
            </UButton>
          </UTooltip>
        </div>
        <div class="flex-1 overflow-auto p-2">
          <UTextarea
            v-model="leftContent"
            :placeholder="t('editor.placeholder')"
            class="h-full font-mono text-sm"
            :rows="20"
            :ui="{ base: 'h-full resize-none' }"
          />
        </div>
      </div>

      <!-- Right panel (Modified) -->
      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex items-center justify-between px-3 py-2 border-b border-default bg-neutral-50 dark:bg-neutral-800/50">
          <span class="text-sm font-medium">{{ t('diff.modified') }}</span>
          <UTooltip :text="t('hints.loadCurrent')">
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="!toonStore.formattedContent"
              @click="loadCurrentAsRight"
            >
              Load current
            </UButton>
          </UTooltip>
        </div>
        <div class="flex-1 overflow-auto p-2">
          <UTextarea
            v-model="rightContent"
            :placeholder="t('editor.placeholder')"
            class="h-full font-mono text-sm"
            :rows="20"
            :ui="{ base: 'h-full resize-none' }"
          />
        </div>
      </div>
    </div>

    <!-- Diff output -->
    <div v-if="diffResult.length > 0" class="border-t border-default max-h-[40%] overflow-auto">
      <div class="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 border-b border-default sticky top-0">
        <span class="text-sm font-medium">{{ t('diff.changes') }}</span>
      </div>
      <div class="p-2 font-mono text-sm">
        <div
          v-for="(part, index) in diffResult"
          :key="index"
          :class="[
            part.added ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
            : part.removed ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              : 'text-neutral-600 dark:text-neutral-400',
          ]"
          class="whitespace-pre-wrap"
        >
          <span v-for="(line, lineIndex) in part.value.split('\n').filter(l => l)" :key="lineIndex" class="block px-2">
            <span class="inline-block w-4 mr-2">{{ part.added ? '+' : part.removed ? '-' : ' ' }}</span>
            {{ line }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="leftContent || rightContent"
      class="flex-1 flex items-center justify-center text-neutral-500"
    >
      <div class="text-center">
        <UIcon name="i-lucide-check-circle" class="w-12 h-12 mb-2 text-green-500" />
        <p>{{ t('diff.noChanges') }}</p>
      </div>
    </div>
  </div>
</template>
