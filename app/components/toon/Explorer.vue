<script setup lang="ts">
import type { ToonTreeItem } from '~/stores/toon'

const { t } = useI18n()
const toonStore = useToonStore()
const toast = useToast()

// Selected item for editing
const selectedItem = ref<ToonTreeItem | null>(null)

// Edit modal state
const showEditModal = ref(false)
const editMode = ref<'edit' | 'addChild' | 'addSibling'>('edit')

// Inline editing state
const editingId = ref<string | null>(null)

// Expanded items
const expandedKeys = ref<string[]>([])

// Toggle expand/collapse
const toggleExpand = (item: ToonTreeItem) => {
  const idx = expandedKeys.value.indexOf(item.id)
  if (idx >= 0) {
    expandedKeys.value.splice(idx, 1)
  } else {
    expandedKeys.value.push(item.id)
  }
}

// Handle edit action (opens modal)
const handleEdit = (item: ToonTreeItem) => {
  // Cancel any inline edit first
  editingId.value = null
  selectedItem.value = item
  editMode.value = 'edit'
  showEditModal.value = true
}

// Handle delete action
const handleDelete = (item: ToonTreeItem) => {
  toonStore.deleteNode(item.path)
  toast.add({
    title: t('actions.delete'),
    description: item.label,
    color: 'success',
    icon: 'i-lucide-trash-2'
  })
}

// Handle boolean toggle (1-click)
const handleToggleBoolean = (item: ToonTreeItem) => {
  if (item.type !== 'boolean') return
  const newValue = !item.value
  toonStore.editNode(item.path, newValue, item.key)
  toast.add({
    title: item.label,
    description: `→ ${newValue}`,
    color: 'success',
    icon: 'i-lucide-toggle-left'
  })
}

// Handle inline edit start
const handleStartInlineEdit = (item: ToonTreeItem) => {
  editingId.value = item.id
}

// Handle inline edit save
const handleSaveInlineEdit = (item: ToonTreeItem, value: unknown) => {
  editingId.value = null
  toonStore.editNode(item.path, value, item.key)
  toast.add({
    title: item.label,
    description: t('actions.saved'),
    color: 'success',
    icon: 'i-lucide-check'
  })
}

// Handle inline edit cancel
const handleCancelInlineEdit = () => {
  editingId.value = null
}

// Expand/collapse all
const expandAll = () => {
  const allKeys: string[] = []
  const collectKeys = (items: ToonTreeItem[]) => {
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        allKeys.push(item.id)
        collectKeys(item.children)
      }
    }
  }
  collectKeys(toonStore.treeItems)
  expandedKeys.value = allKeys
}

const collapseAll = () => {
  expandedKeys.value = []
}

// Get icon for type
const getTypeIcon = (type: string): string => {
  switch (type) {
    case 'string': return 'i-lucide-text'
    case 'number': return 'i-lucide-hash'
    case 'boolean': return 'i-lucide-toggle-left'
    case 'null': return 'i-lucide-circle-slash'
    case 'object': return 'i-lucide-braces'
    case 'array': return 'i-lucide-list'
    default: return 'i-lucide-file'
  }
}

// Get type color
const getTypeColor = (type: string): string => {
  switch (type) {
    case 'string': return 'text-green-500'
    case 'number': return 'text-blue-500'
    case 'boolean': return 'text-purple-500'
    case 'null': return 'text-gray-400'
    case 'object': return 'text-amber-500'
    case 'array': return 'text-cyan-500'
    default: return 'text-gray-500'
  }
}

// Format value preview
const formatValuePreview = (item: ToonTreeItem): string => {
  if (item.type === 'object') {
    const count = item.children?.length || 0
    return `{${count}}`
  }
  if (item.type === 'array') {
    const count = item.children?.length || 0
    return `[${count}]`
  }
  if (item.type === 'null') {
    return 'null'
  }
  if (item.type === 'string') {
    const str = String(item.value)
    return str.length > 20 ? `"${str.substring(0, 20)}..."` : `"${str}"`
  }
  if (item.type === 'boolean') {
    return item.value ? 'true' : 'false'
  }
  return String(item.value)
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
        <UTooltip :text="t('tree.expandAll')">
          <UButton
            icon="i-lucide-unfold-vertical"
            size="xs"
            color="neutral"
            variant="ghost"
            :disabled="!toonStore.parsedData"
            @click="expandAll"
          />
        </UTooltip>
        <UTooltip :text="t('tree.collapseAll')">
          <UButton
            icon="i-lucide-fold-vertical"
            size="xs"
            color="neutral"
            variant="ghost"
            :disabled="!toonStore.parsedData"
            @click="collapseAll"
          />
        </UTooltip>
      </div>
    </div>

    <!-- Tree view - custom implementation for proper interaction -->
    <div class="flex-1 overflow-auto p-2">
      <template v-if="toonStore.treeItems.length > 0">
        <TreeNode
          v-for="item in toonStore.treeItems"
          :key="item.id"
          :item="item"
          :level="0"
          :expanded-keys="expandedKeys"
          :editing-id="editingId"
          :get-type-icon="getTypeIcon"
          :get-type-color="getTypeColor"
          :format-value-preview="formatValuePreview"
          @toggle="toggleExpand"
          @edit="handleEdit"
          @delete="handleDelete"
          @toggle-boolean="handleToggleBoolean"
          @start-inline-edit="handleStartInlineEdit"
          @save-inline-edit="handleSaveInlineEdit"
          @cancel-inline-edit="handleCancelInlineEdit"
        />
      </template>

      <!-- Empty state -->
      <div v-else class="flex flex-col items-center justify-center h-full text-neutral-500 p-8">
        <UIcon name="i-lucide-file-code" class="w-12 h-12 mb-2" />
        <p class="text-sm">
          {{ t('explorer.noData') }}
        </p>
        <p class="text-xs mt-1">
          {{ t('explorer.loadFile') }}
        </p>
      </div>
    </div>

    <!-- Edit Modal -->
    <ToonEditNodeModal
      v-if="showEditModal && selectedItem"
      v-model:open="showEditModal"
      :item="selectedItem"
      :mode="editMode"
      @close="showEditModal = false"
    />
  </div>
</template>
