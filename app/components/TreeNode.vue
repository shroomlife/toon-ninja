<script setup lang="ts">
import type { ToonTreeItem } from '~/stores/toon'

interface Props {
  item: ToonTreeItem
  level: number
  expandedKeys: string[]
  editingId: string | null
  dragOverId: string | null
  dragPosition: 'before' | 'after' | 'inside' | null
  getTypeIcon: (type: string) => string
  getTypeColor: (type: string) => string
  formatValuePreview: (item: ToonTreeItem) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: [item: ToonTreeItem]
  edit: [item: ToonTreeItem]
  delete: [item: ToonTreeItem]
  add: [item: ToonTreeItem]
  toggleBoolean: [item: ToonTreeItem]
  startInlineEdit: [item: ToonTreeItem]
  saveInlineEdit: [item: ToonTreeItem, value: unknown]
  cancelInlineEdit: []
  dragStart: [item: ToonTreeItem]
  dragOver: [item: ToonTreeItem, position: 'before' | 'after' | 'inside']
  dragLeave: []
  drop: [item: ToonTreeItem]
}>()

// Local state for inline editing
const editValue = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)

const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0
})

const isExpanded = computed(() => {
  return props.expandedKeys.includes(props.item.id)
})

const isEditing = computed(() => {
  return props.editingId === props.item.id
})

const isDragOver = computed(() => {
  return props.dragOverId === props.item.id
})

// Check if this item can be inline-edited (primitive types only)
const canInlineEdit = computed(() => {
  const type = props.item.type
  if (type === 'object' || type === 'array' || type === 'null') return false
  // For strings: only inline if short and single-line
  if (type === 'string') {
    const val = String(props.item.value ?? '')
    return val.length <= 50 && !val.includes('\n')
  }
  return true // number, boolean
})

// Can add children (only objects and arrays)
const canAddChild = computed(() => {
  return props.item.type === 'object' || props.item.type === 'array'
})

// Start inline editing
const startEditing = () => {
  if (props.item.type === 'boolean') {
    // Boolean: direct toggle, no edit mode
    emit('toggleBoolean', props.item)
    return
  }

  if (!canInlineEdit.value) {
    // Complex item: open modal
    emit('edit', props.item)
    return
  }

  // Start inline edit
  editValue.value = props.item.type === 'string'
    ? String(props.item.value ?? '')
    : String(props.item.value ?? '')
  emit('startInlineEdit', props.item)

  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

// Save inline edit
const saveEdit = () => {
  if (!isEditing.value) return

  let newValue: unknown = editValue.value

  // Convert to correct type
  if (props.item.type === 'number') {
    const num = Number(editValue.value)
    if (isNaN(num)) {
      cancelEdit()
      return
    }
    // TOON spec: -0 becomes 0
    newValue = Object.is(num, -0) ? 0 : num
  }

  emit('saveInlineEdit', props.item, newValue)
}

// Cancel inline edit
const cancelEdit = () => {
  emit('cancelInlineEdit')
}

// Handle keydown in input
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    saveEdit()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    cancelEdit()
  }
}

const handleChevronClick = (e: MouseEvent) => {
  e.stopPropagation()
  emit('toggle', props.item)
}

const handleRowClick = () => {
  if (hasChildren.value) {
    emit('toggle', props.item)
  }
}

const handleValueClick = (e: MouseEvent) => {
  e.stopPropagation()
  if (!isEditing.value) {
    startEditing()
  }
}

const handleEditButton = (e: MouseEvent) => {
  e.stopPropagation()
  emit('edit', props.item) // Always open modal for full edit
}

const handleAddButton = (e: MouseEvent) => {
  e.stopPropagation()
  emit('add', props.item)
}

const handleDelete = (e: MouseEvent) => {
  e.stopPropagation()
  emit('delete', props.item)
}

// Drag & Drop handlers
const handleDragStart = (e: DragEvent) => {
  e.dataTransfer?.setData('text/plain', props.item.id)
  emit('dragStart', props.item)
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const y = e.clientY - rect.top
  const height = rect.height

  let position: 'before' | 'after' | 'inside' = 'after'
  if (y < height * 0.25) {
    position = 'before'
  } else if (y > height * 0.75 || !canAddChild.value) {
    position = 'after'
  } else {
    position = 'inside'
  }

  emit('dragOver', props.item, position)
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  emit('dragLeave')
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  emit('drop', props.item)
}
</script>

<template>
  <div>
    <!-- Node row - fixed height h-7 to prevent jittering -->
    <div
      class="group flex items-center gap-1.5 h-7 px-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none transition-colors"
      :class="{
        'bg-primary-50 dark:bg-primary-900/20 border-t-2 border-primary': isDragOver && dragPosition === 'before',
        'bg-primary-50 dark:bg-primary-900/20 border-b-2 border-primary': isDragOver && dragPosition === 'after',
        'bg-primary-100 dark:bg-primary-900/40 ring-2 ring-primary ring-inset': isDragOver && dragPosition === 'inside'
      }"
      :style="{ paddingLeft: `${level * 16 + 4}px` }"
      draggable="true"
      @click="handleRowClick"
      @dragstart="handleDragStart"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <!-- Chevron for expandable nodes -->
      <button
        v-if="hasChildren"
        class="w-4 h-4 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 shrink-0"
        @click="handleChevronClick"
      >
        <UIcon
          :name="isExpanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          class="w-3 h-3 text-gray-400"
        />
      </button>
      <span v-else class="w-4 shrink-0" />

      <!-- Type icon -->
      <UIcon
        :name="getTypeIcon(item.type)"
        class="w-3.5 h-3.5 shrink-0"
        :class="getTypeColor(item.type)"
      />

      <!-- Key name -->
      <span class="font-medium text-sm text-gray-900 dark:text-white truncate">
        {{ item.label }}
      </span>

      <!-- Value: Inline edit or display -->
      <template v-if="isEditing && item.type !== 'boolean'">
        <!-- Inline input for string/number -->
        <input
          ref="inputRef"
          v-model="editValue"
          :type="item.type === 'number' ? 'number' : 'text'"
          class="flex-1 min-w-20 max-w-48 h-5 px-1.5 text-xs rounded border border-primary bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-primary"
          :class="getTypeColor(item.type)"
          @blur="saveEdit"
          @keydown="handleKeydown"
          @click.stop
        >
      </template>
      <template v-else>
        <!-- Value preview (clickable for inline edit) -->
        <UTooltip :text="item.type === 'boolean' ? $t('hints.toggleBoolean') : $t('hints.clickToEdit')">
          <span
            class="text-xs truncate max-w-32 cursor-pointer hover:underline"
            :class="[
              getTypeColor(item.type),
              item.type === 'boolean' ? 'hover:opacity-70' : ''
            ]"
            @click="handleValueClick"
          >
            {{ formatValuePreview(item) }}
          </span>
        </UTooltip>
      </template>

      <!-- Spacer -->
      <span class="flex-1" />

      <!-- Action buttons - opacity transition to prevent jitter -->
      <div class="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <!-- Add button (only for objects/arrays) -->
        <UTooltip v-if="canAddChild" :text="$t('hints.addChild')">
          <button
            class="w-5 h-5 flex items-center justify-center rounded hover:bg-green-100 dark:hover:bg-green-900/30"
            @click="handleAddButton"
          >
            <UIcon name="i-lucide-plus" class="w-3 h-3 text-gray-400 hover:text-green-500" />
          </button>
        </UTooltip>
        <UTooltip :text="$t('hints.editNode')">
          <button
            class="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            @click="handleEditButton"
          >
            <UIcon name="i-lucide-pencil" class="w-3 h-3 text-gray-400 hover:text-primary" />
          </button>
        </UTooltip>
        <UTooltip :text="$t('hints.deleteNode')">
          <button
            class="w-5 h-5 flex items-center justify-center rounded hover:bg-red-100 dark:hover:bg-red-900/30"
            @click="handleDelete"
          >
            <UIcon name="i-lucide-trash-2" class="w-3 h-3 text-gray-400 hover:text-red-500" />
          </button>
        </UTooltip>
      </div>
    </div>

    <!-- Children (recursive) -->
    <div v-if="hasChildren && isExpanded">
      <TreeNode
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :level="level + 1"
        :expanded-keys="expandedKeys"
        :editing-id="editingId"
        :drag-over-id="dragOverId"
        :drag-position="dragPosition"
        :get-type-icon="getTypeIcon"
        :get-type-color="getTypeColor"
        :format-value-preview="formatValuePreview"
        @toggle="emit('toggle', $event)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @add="emit('add', $event)"
        @toggle-boolean="emit('toggleBoolean', $event)"
        @start-inline-edit="emit('startInlineEdit', $event)"
        @save-inline-edit="(item, val) => emit('saveInlineEdit', item, val)"
        @cancel-inline-edit="emit('cancelInlineEdit')"
        @drag-start="emit('dragStart', $event)"
        @drag-over="(item, pos) => emit('dragOver', item, pos)"
        @drag-leave="emit('dragLeave')"
        @drop="emit('drop', $event)"
      />
    </div>
  </div>
</template>
