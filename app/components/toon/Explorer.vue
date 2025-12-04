<script setup lang="ts">
import type { ToonTreeItem } from '~/stores/toon'

const { t } = useI18n()
const toonStore = useToonStore()
const toast = useToast()

// Selected item for context menu
const selectedItem = ref<ToonTreeItem | null>(null)
const contextMenuOpen = ref(false)

// Edit modal state
const showEditModal = ref(false)
const editMode = ref<'edit' | 'addChild' | 'addSibling'>('edit')

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

// Open context menu
const openContextMenu = (item: ToonTreeItem) => {
  selectedItem.value = item
  contextMenuOpen.value = true
}

// Context menu actions
const handleEditValue = () => {
  if (!selectedItem.value) return
  editMode.value = 'edit'
  showEditModal.value = true
  contextMenuOpen.value = false
}

const handleAddChild = () => {
  if (!selectedItem.value) return
  editMode.value = 'addChild'
  showEditModal.value = true
  contextMenuOpen.value = false
}

const handleAddSibling = () => {
  if (!selectedItem.value) return
  editMode.value = 'addSibling'
  showEditModal.value = true
  contextMenuOpen.value = false
}

const handleDuplicate = () => {
  if (!selectedItem.value) return
  toonStore.duplicateNode(selectedItem.value.path)
  toast.add({
    title: t('success.copied'),
    color: 'success',
    icon: 'i-lucide-copy'
  })
  contextMenuOpen.value = false
}

const handleDelete = () => {
  if (!selectedItem.value) return
  toonStore.deleteNode(selectedItem.value.path)
  toast.add({
    title: t('actions.delete'),
    description: t('success.saved'),
    color: 'success',
    icon: 'i-lucide-trash-2'
  })
  contextMenuOpen.value = false
}

const handleCopyPath = async () => {
  if (!selectedItem.value) return
  const path = selectedItem.value.path.join('.')
  await navigator.clipboard.writeText(path)
  toast.add({
    title: t('success.copied'),
    description: path,
    color: 'success',
    icon: 'i-lucide-clipboard-check'
  })
  contextMenuOpen.value = false
}

const handleCopyValue = async () => {
  if (!selectedItem.value) return
  const value = selectedItem.value.value
  const text = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? 'null')
  await navigator.clipboard.writeText(text)
  toast.add({
    title: t('success.copied'),
    color: 'success',
    icon: 'i-lucide-clipboard-check'
  })
  contextMenuOpen.value = false
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

// Check if item can have children
const canHaveChildren = (item: ToonTreeItem): boolean => {
  return item.type === 'object' || item.type === 'array'
}

// Recursive tree node render helper
interface MenuItemBase {
  label: string
  icon: string
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  onSelect?: (e: Event) => void
}

const contextMenuItems = computed(() => {
  if (!selectedItem.value) return []

  const items: MenuItemBase[][] = [
    [
      {
        label: t('contextMenu.editValue'),
        icon: 'i-lucide-pencil',
        onSelect: handleEditValue
      }
    ],
    [
      ...(canHaveChildren(selectedItem.value)
        ? [{
            label: t('contextMenu.addChild'),
            icon: 'i-lucide-plus',
            onSelect: handleAddChild
          }]
        : []),
      {
        label: t('contextMenu.addSibling'),
        icon: 'i-lucide-plus-circle',
        onSelect: handleAddSibling
      },
      {
        label: t('contextMenu.duplicate'),
        icon: 'i-lucide-copy',
        onSelect: handleDuplicate
      }
    ],
    [
      {
        label: t('contextMenu.copyPath'),
        icon: 'i-lucide-link',
        onSelect: handleCopyPath
      },
      {
        label: t('contextMenu.copyValue'),
        icon: 'i-lucide-clipboard',
        onSelect: handleCopyValue
      }
    ],
    [
      {
        label: t('contextMenu.delete'),
        icon: 'i-lucide-trash-2',
        color: 'error',
        onSelect: handleDelete
      }
    ]
  ]

  return items
})
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
          :get-type-icon="getTypeIcon"
          :get-type-color="getTypeColor"
          :format-value-preview="formatValuePreview"
          @toggle="toggleExpand"
          @context-menu="openContextMenu"
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

    <!-- Context Menu -->
    <UContextMenu
      v-model:open="contextMenuOpen"
      :items="contextMenuItems"
    >
      <template #default>
        <div />
      </template>
    </UContextMenu>

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
