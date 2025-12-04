<script setup lang="ts">
const { t } = useI18n()
const toonStore = useToonStore()
const toast = useToast()

const findText = ref('')
const replaceText = ref('')
const matchCase = ref(false)
const useRegex = ref(false)
const matchCount = ref(0)
const isOpen = ref(false)

function countMatches() {
  if (!findText.value || !toonStore.rawContent) {
    matchCount.value = 0
    return
  }

  try {
    let flags = 'g'
    if (!matchCase.value) flags += 'i'

    const regex = useRegex.value
      ? new RegExp(findText.value, flags)
      : new RegExp(escapeRegex(findText.value), flags)

    const matches = toonStore.rawContent.match(regex)
    matchCount.value = matches ? matches.length : 0
  } catch {
    matchCount.value = 0
  }
}

function replaceAll() {
  if (!findText.value) return

  const count = toonStore.batchReplace(findText.value, replaceText.value, useRegex.value, matchCase.value)

  if (count > 0) {
    toast.add({
      title: t('success.saved'),
      description: `Replaced ${count} occurrences`,
      color: 'success'
    })
    matchCount.value = 0
    findText.value = ''
    replaceText.value = ''
  }
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

watch(findText, countMatches)
watch(matchCase, countMatches)
watch(useRegex, countMatches)
watch(() => toonStore.rawContent, countMatches)
</script>

<template>
  <UModal v-model:open="isOpen">
    <UButton
      icon="i-lucide-replace-all"
      size="sm"
      color="neutral"
      variant="ghost"
    >
      {{ t('batch.title') }}
    </UButton>

    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-replace-all" class="w-5 h-5" />
            <h3 class="font-semibold">
              {{ t('batch.findReplace') }}
            </h3>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Find input -->
          <div>
            <label class="block text-sm font-medium mb-1">{{ t('batch.find') }}</label>
            <UInput
              v-model="findText"
              :placeholder="t('batch.find')"
              icon="i-lucide-search"
            />
            <p v-if="matchCount > 0" class="mt-1 text-sm text-primary">
              {{ t('batch.found', { count: matchCount }) }}
            </p>
          </div>

          <!-- Replace input -->
          <div>
            <label class="block text-sm font-medium mb-1">{{ t('batch.replace') }}</label>
            <UInput
              v-model="replaceText"
              :placeholder="t('batch.replace')"
              icon="i-lucide-pencil"
            />
          </div>

          <!-- Options -->
          <div class="flex items-center gap-4">
            <UCheckbox v-model="matchCase" :label="t('batch.matchCase')" />
            <UCheckbox v-model="useRegex" :label="t('batch.regex')" />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              @click="isOpen = false"
            >
              {{ t('actions.cancel') }}
            </UButton>
            <UButton
              :disabled="!findText || matchCount === 0"
              @click="replaceAll"
            >
              {{ t('batch.replaceAll') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
