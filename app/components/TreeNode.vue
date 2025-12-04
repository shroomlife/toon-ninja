<script setup lang="ts">
import type { ToonTreeItem } from '~/stores/toon'

interface Props {
  item: ToonTreeItem
  level: number
  expandedKeys: string[]
  getTypeIcon: (type: string) => string
  getTypeColor: (type: string) => string
  formatValuePreview: (item: ToonTreeItem) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: [item: ToonTreeItem]
  contextMenu: [item: ToonTreeItem]
}>()

const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0
})

const isExpanded = computed(() => {
  return props.expandedKeys.includes(props.item.id)
})

const handleChevronClick = (e: MouseEvent) => {
  e.stopPropagation()
  emit('toggle', props.item)
}

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  emit('contextMenu', props.item)
}
</script>

<template>
  <div>
    <!-- Node row -->
    <div
      class="flex items-center gap-1.5 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none"
      :style="{ paddingLeft: `${level * 16 + 4}px` }"
      @contextmenu="handleContextMenu"
    >
      <!-- Chevron for expandable nodes -->
      <button
        v-if="hasChildren"
        class="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 shrink-0"
        @click="handleChevronClick"
      >
        <UIcon
          :name="isExpanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          class="w-3.5 h-3.5 text-gray-400"
        />
      </button>
      <span v-else class="w-5 shrink-0" />

      <!-- Type icon -->
      <UIcon
        :name="getTypeIcon(item.type)"
        class="w-4 h-4 shrink-0"
        :class="getTypeColor(item.type)"
      />

      <!-- Key name -->
      <span class="font-medium text-sm text-gray-900 dark:text-white truncate">
        {{ item.label }}
      </span>

      <!-- Value preview -->
      <span
        class="text-xs truncate ml-auto"
        :class="getTypeColor(item.type)"
      >
        {{ formatValuePreview(item) }}
      </span>
    </div>

    <!-- Children (recursive) -->
    <div v-if="hasChildren && isExpanded">
      <TreeNode
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :level="level + 1"
        :expanded-keys="expandedKeys"
        :get-type-icon="getTypeIcon"
        :get-type-color="getTypeColor"
        :format-value-preview="formatValuePreview"
        @toggle="emit('toggle', $event)"
        @context-menu="emit('contextMenu', $event)"
      />
    </div>
  </div>
</template>
