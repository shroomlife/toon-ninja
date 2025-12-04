<script setup lang="ts">
import type { ToonTreeItem } from '~/stores/toon'

interface Props {
  item: ToonTreeItem
  level: number
  expandedKeys: string[]
  editingId: string | null
  getTypeIcon: (type: string) => string
  getTypeColor: (type: string) => string
  formatValuePreview: (item: ToonTreeItem) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: [item: ToonTreeItem]
  edit: [item: ToonTreeItem]
  delete: [item: ToonTreeItem]
  toggleBoolean: [item: ToonTreeItem]
  startInlineEdit: [item: ToonTreeItem]
  saveInlineEdit: [item: ToonTreeItem, value: unknown]
  cancelInlineEdit: []
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

const handleDelete = (e: MouseEvent) => {
  e.stopPropagation()
  emit('delete', props.item)
}
</script>

<template>
  <div>
    <!-- Node row - fixed height h-7 to prevent jittering -->
    <div
      class="group flex items-center gap-1.5 h-7 px-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none"
      :style="{ paddingLeft: `${level * 16 + 4}px` }"
      @click="handleRowClick"
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
        <span
          class="text-xs truncate max-w-32 cursor-pointer hover:underline"
          :class="[
            getTypeColor(item.type),
            item.type === 'boolean' ? 'hover:opacity-70' : ''
          ]"
          :title="item.type === 'boolean' ? 'Click to toggle' : 'Click to edit'"
          @click="handleValueClick"
        >
          {{ formatValuePreview(item) }}
        </span>
      </template>

      <!-- Spacer -->
      <span class="flex-1" />

      <!-- Action buttons - opacity transition to prevent jitter -->
      <div class="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          class="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Edit (Modal)"
          @click="handleEditButton"
        >
          <UIcon name="i-lucide-pencil" class="w-3 h-3 text-gray-400 hover:text-primary" />
        </button>
        <button
          class="w-5 h-5 flex items-center justify-center rounded hover:bg-red-100 dark:hover:bg-red-900/30"
          title="Delete"
          @click="handleDelete"
        >
          <UIcon name="i-lucide-trash-2" class="w-3 h-3 text-gray-400 hover:text-red-500" />
        </button>
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
        :get-type-icon="getTypeIcon"
        :get-type-color="getTypeColor"
        :format-value-preview="formatValuePreview"
        @toggle="emit('toggle', $event)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @toggle-boolean="emit('toggleBoolean', $event)"
        @start-inline-edit="emit('startInlineEdit', $event)"
        @save-inline-edit="(item, val) => emit('saveInlineEdit', item, val)"
        @cancel-inline-edit="emit('cancelInlineEdit')"
      />
    </div>
  </div>
</template>
