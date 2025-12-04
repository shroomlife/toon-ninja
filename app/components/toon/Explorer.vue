<script setup lang="ts">
const { t } = useI18n()
const toonStore = useToonStore()

function handleToggle(path: string[]) {
  toonStore.toggleNode(path)
}

function handleSelect(path: string[]) {
  toonStore.selectNode(path)
}

function handleDelete(path: string[]) {
  toonStore.deleteNode(path)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-default">
      <h3 class="font-semibold text-sm">
        {{ t('explorer.title') }}
      </h3>
      <div class="flex gap-1">
        <UTooltip :text="t('explorer.expandAll')">
          <UButton
            icon="i-lucide-unfold-vertical"
            size="xs"
            color="neutral"
            variant="ghost"
            :disabled="!toonStore.parsedData"
            @click="toonStore.expandAll"
          />
        </UTooltip>
        <UTooltip :text="t('explorer.collapseAll')">
          <UButton
            icon="i-lucide-fold-vertical"
            size="xs"
            color="neutral"
            variant="ghost"
            :disabled="!toonStore.parsedData"
            @click="toonStore.collapseAll"
          />
        </UTooltip>
      </div>
    </div>

    <!-- Search -->
    <div class="px-2 py-2 border-b border-default">
      <UInput
        v-model="toonStore.searchQuery"
        :placeholder="t('explorer.search')"
        icon="i-lucide-search"
        size="sm"
        @update:model-value="toonStore.setSearchQuery"
      />
    </div>

    <!-- Tree view -->
    <div class="flex-1 overflow-auto p-2">
      <template v-if="toonStore.treeData.length > 0">
        <ToonTreeNode
          v-for="node in toonStore.treeData"
          :key="node.id"
          :node="node"
          @toggle="handleToggle"
          @select="handleSelect"
          @delete="handleDelete"
        />
      </template>
      <div v-else class="flex flex-col items-center justify-center h-full text-neutral-500">
        <UIcon name="i-lucide-file-json" class="w-12 h-12 mb-2" />
        <p class="text-sm">
          {{ t('explorer.noData') }}
        </p>
        <p class="text-xs mt-1">
          {{ t('explorer.loadFile') }}
        </p>
      </div>
    </div>

    <!-- Search results count -->
    <div
      v-if="toonStore.searchQuery && toonStore.searchResults.length > 0"
      class="px-3 py-1 border-t border-default text-xs text-neutral-500"
    >
      {{ t('batch.found', { count: toonStore.searchResults.length }) }}
    </div>
  </div>
</template>
